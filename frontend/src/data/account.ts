import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useQuery } from "@tanstack/react-query"
import { sleep } from "@cosmjs/utils"
import type { EncodeObject } from "@cosmjs/proto-signing"
import { DirectSecp256k1HdWallet, DirectSecp256k1Wallet } from "@cosmjs/proto-signing"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import type { DeliverTxResponse } from "@cosmjs/stargate"
import { GasPrice, SigningStargateClient, StargateClient, isDeliverTxFailure } from "@cosmjs/stargate"
import { stringToPath } from "@cosmjs/crypto"
import type { TendermintClient } from "@cosmjs/tendermint-rpc"
import { Tendermint37Client } from "@cosmjs/tendermint-rpc"
import { GAS_PRICE, INIT_DENOM, RPC_URL } from "./constants"
import BigNumber from "bignumber.js"

type Account = MnemonicAccount | PrivateKeyAccount
const stargateClient = await StargateClient.connect(RPC_URL)
// const clientOptions = {
//   registry: null, //createDefaultRegistry(),
//   gasPrice: GasPrice.fromString(GAS_PRICE),
// }

const clientOptions = {}
interface MnemonicAccount {
  type: "mnemonic"
  address: string
  mnemonic: string
  index: number
}

interface PrivateKeyAccount {
  type: "privateKey"
  address: string
  privateKey: string
}

function getLocalAccounts() {
  const accounts = localStorage.getItem("accounts")
  return accounts ? JSON.parse(accounts) : []
}

function getLocalAddress() {
  const address = localStorage.getItem("address")
  return address ? address : ""
}

const accountsState = atom<Account[]>({
  key: "accounts",
  default: getLocalAccounts(),
})

const addressState = atom<string>({
  key: "account",
  default: getLocalAddress(),
})

function useAccount() {
  const accounts = useRecoilValue(accountsState)
  const address = useRecoilValue(addressState)
  return accounts.find((account) => account.address === address)
}

function getWalletOptions(index: number) {
  const hdPath = `m/44'/118'/0'/0/${index}`
  return { prefix: "init", hdPaths: [stringToPath(hdPath)] }
}

async function getWallet(account: Account) {
  switch (account.type) {
    case "mnemonic":
      const { mnemonic, index } = account
      return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, getWalletOptions(index))

    case "privateKey":
      const { privateKey } = account
      return await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, "hex"), "init")
  }
}

export function useManageAccount() {
  const [accounts, setAccounts] = useRecoilState(accountsState)
  const connectedAddress = useRecoilValue(addressState)

  const connect = useSetRecoilState(addressState)

  const create = async (params: Account) => {
    const wallet = await getWallet(params)
    const [{ address }] = await wallet.getAccounts()
    if (accounts.some((account) => account.address === address)) throw new Error("Account already exists")
    const newAccounts = [...accounts, { ...params, address }]
    setAccounts(newAccounts)
    localStorage.setItem("accounts", JSON.stringify(newAccounts))
    connect(address)
    localStorage.setItem("address", address)
  }

  const remove = (address: string) => {
    const newAccounts = accounts.filter((account) => account.address !== address)
    setAccounts(newAccounts)
    localStorage.setItem("accounts", JSON.stringify(newAccounts))

    if (address === connectedAddress) {
      connect("")
      localStorage.setItem("address", "")
    }
  }

  return { accounts, connect, create, remove }
}

const tmClientAtom = atom<TendermintClient | null>({
  key: "tmClient",
  default: null,
})

const chainIdState = atom({
  key: "chainId",
  default: "",
})

const accountDataState = atom<{ accountNumber: number; sequence: number } | null>({
  key: "accountData",
  default: null,
})

async function pollTx(transactionHash: string): Promise<DeliverTxResponse> {
  const tx = await stargateClient.getTx(transactionHash)
  if (tx) return { ...tx, transactionHash }
  await sleep(100)
  return await pollTx(transactionHash)
}

export function useSignAndBroadcastTxSync() {
  const address = useAddress()
  const account = useAccount()

  const [tmClient, setTmClient] = useRecoilState(tmClientAtom)
  const [chainId, setChainId] = useRecoilState(chainIdState)
  const [accountData, setAccountData] = useRecoilState(accountDataState)

  useQuery({
    queryKey: ["tmClient", RPC_URL],
    queryFn: async () => await Tendermint37Client.connect(RPC_URL),
    onSuccess: (tmClient) => setTmClient(tmClient),
    enabled: !tmClient,
  })

  useQuery({
    queryKey: ["chainId", RPC_URL],
    queryFn: async () => await stargateClient.getChainId(),
    onSuccess: (chainId) => setChainId(chainId),
    enabled: !chainId,
  })

  useQuery({
    queryKey: ["accountData", address, RPC_URL],
    queryFn: async () => await stargateClient.getAccount(address),
    onSuccess: (account) => setAccountData(account),
  })

  return async (messages: readonly EncodeObject[], gas = 1e7, memo = "") => {
    if (!account) throw new Error("Account not found")
    const { address } = account
    const wallet = await getWallet(account)
    if (!tmClient) throw new Error("Tendermint client not found")
    if (!chainId) throw new Error("Chain ID not found")
    if (!accountData) throw new Error("Account number and sequence not found")

    const signer = await SigningStargateClient.createWithSigner(tmClient, wallet, clientOptions)
    const fee = {
      amount: [
        {
          denom: "uinit",
          amount: BigNumber("0.15").times(gas).toString(),
        },
      ],
      gas: String(gas),
    }
  
    const explicitSignerData = { chainId, ...accountData }
    const signed = await signer.sign(address, messages, fee, memo, explicitSignerData)
    const tx = TxRaw.encode(signed).finish()
    const txhash = await stargateClient.broadcastTxSync(tx)
    setAccountData({ ...accountData, sequence: accountData.sequence + 1 })
    const response = await pollTx(txhash)
    if (isDeliverTxFailure(response)) throw new Error(response.rawLog)
    return response
  }
}

export function useAddress() {
  return useRecoilValue(addressState)
}

export function useBalance() {
  const address = useAddress()
  return "0"
}
