import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base"
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { CommonPrivateKeyProvider } from "@web3auth/base-provider"
import { WEB3AUTH_KEY, WEB3AUTH_SECRET, RPC_URL } from "../../../data/constants"
import { whitelistUrl } from "@toruslabs/openlogin"
import { MnemonicKey } from "@initia/initia.js"

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: "0x2", //mainnet: 0x1, testnet: 0x2
  rpcTarget: RPC_URL,
  displayName: "Initia Testnet",
  blockExplorer: "",
  ticker: "INIT",
  tickerName: "Initia",
}

export function generateMnemonic(){
  return new MnemonicKey()
}

export async function requestUserInfo(loginProvider: string) {
  const web3auth = new Web3AuthNoModal({
    clientId: WEB3AUTH_KEY,
    chainConfig,
    web3AuthNetwork: "testnet",
  })

  const origin = "https://chicken-and-eggs.vercel.app"

  const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } })
  const sig = await whitelistUrl(WEB3AUTH_KEY, WEB3AUTH_SECRET, origin)
  const adapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "none",
    },
    privateKeyProvider,
    adapterSettings: {
      originData: { [origin]: sig}
    }
  })

  web3auth.configureAdapter(adapter)

  await web3auth.init()
  if (web3auth.status === "connected") await adapter.disconnect()
  const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider })
  if (!web3authProvider) throw new Error("Web3Auth provider not found")
  const privateKey = (await web3authProvider.request({ method: "private_key" })) as string
  const { name, email } = await web3auth.getUserInfo()
  return { name, email, privateKey }
}
