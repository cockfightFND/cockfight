import type { ReactNode } from "react"
import type { Token, Paginated } from "@initia/marketplace-api-types"
import { useAPI } from "../data/api"
import { useAddress } from "../data/account"

interface Props {
  collectionAddress: string
  children: (collection: Paginated<Token[]>) => ReactNode
}

const WithCollectionDetailInfo = ({ collectionAddress, children }: Props) => {
  const address = useAddress()
  const { data: collection } = useAPI<Paginated<Token[]>>(`/inventories/${collectionAddress}/${address}`)
  if (!collection) return null
  return children(collection)
}

export default WithCollectionDetailInfo
