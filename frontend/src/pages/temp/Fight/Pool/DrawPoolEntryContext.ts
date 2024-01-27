import { createContext } from "@initia/react-api"
import type { PoolResponse } from "@initia/marketplace-api-types"

interface Props {
  pool: PoolResponse
  ticketAmount: number
  setTicketAmount: (amount: number) => void
  submit: () => void
}

export const [useDrawPoolEntry, DrawPoolEntryProvider] = createContext<Props>("DrawPoolEntry")

export const [useBuy, BuyProvider] = createContext("BuyEntry")
