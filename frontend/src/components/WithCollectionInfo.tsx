import type { ReactNode } from "react"
import type { CollectionResponse } from "@initia/marketplace-api-types"
import { useAPI } from "../data/api"

interface Props {
  collectionAddress: string
  children: (collection: CollectionResponse) => ReactNode
}

const WithCollectionInfo = ({ collectionAddress, children }: Props) => {
  const { data: collection } = useAPI<CollectionResponse>("/collections/" + collectionAddress)
  if (!collection) return null
  return children(collection)
}

export default WithCollectionInfo
