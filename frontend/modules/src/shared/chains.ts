import type { CosmosChain, EthereumChain, InitiaChain, Chain } from "@initia/shared"
import initia from "./chains/initia.json"
import osmosis from "./chains/osmosis.json"
import axelar from "./chains/axelar.json"
import ethereum from "./chains/ethereum.json"

export const chains = new Map<string, Chain>([
  ["initia", initia as InitiaChain],
  ["osmosis", osmosis as CosmosChain],
  ["axelar", axelar as CosmosChain],
  ["ethereum", ethereum as EthereumChain],
])
