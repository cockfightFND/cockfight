import { LCDClient } from "@initia/initia.js"
import { StargateClient } from "@cosmjs/stargate"

export const network = {
  name: import.meta.env.INITIA_NETWORK_NAME || "testnet",
  rest: import.meta.env.INITIA_NETWORK_REST_URL || "https://lcd.stone-13.initia.xyz",
  rpc: import.meta.env.INITIA_NETWORK_RPC_URL || "https://rpc.stone-13.initia.xyz",
  api: import.meta.env.INITIA_NETWORK_API_URL || "https://api.stone-13.initia.xyz",
  compiler: import.meta.env.INITIA_NETWORK_COMPILER_URL || "https://compiler.stone-13.initia.xyz",
  explorer: import.meta.env.INITIA_NETWORK_EXPLORER_URL || "https://scan.testnet.initia.xyz",
}

export const lcd = new LCDClient(network.rest)

const client = await StargateClient.connect(network.rpc)
export const chainId = await client.getChainId()
