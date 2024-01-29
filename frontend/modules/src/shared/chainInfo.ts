import { chainId, network } from "./env"

const RPC = network.rpc
const REST = network.rest

const currency = {
  coinDenom: "INIT",
  coinMinimalDenom: "uinit",
  coinDecimals: 6,
}

const chainInfo = {
  chainId,
  rpc: RPC,
  rest: REST,
  chainName: "Initia",
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "init",
    bech32PrefixAccPub: "initpub",
    bech32PrefixValAddr: "initvaloper",
    bech32PrefixValPub: "initvaloperpub",
    bech32PrefixConsAddr: "initvalcons",
    bech32PrefixConsPub: "initvalconspub",
  },
  currencies: [currency],
  feeCurrencies: [{ ...currency, gasPriceStep: { low: 0.15, average: 0.15, high: 0.15 } }],
  stakeCurrency: currency,
}

export default chainInfo
