import type { ReactNode } from "react"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import { useAPI } from "../data/api"

interface Props {
  collectionAddress: string
  tokenAddress: string
  children: (tokenInfo: TokenDetailResponse) => ReactNode
}

const WithTokenDetails = ({ collectionAddress, tokenAddress, children }: Props) => {
  const { data } = useAPI<TokenDetailResponse>(`/tokens/${collectionAddress}/${encodeURIComponent(tokenAddress ?? "")}`)
  if (!data) return null
  return children(data)
}

export default WithTokenDetails
