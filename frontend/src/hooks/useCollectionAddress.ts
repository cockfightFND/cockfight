import { useParams } from "react-router-dom"

const useCollectionAddress = () => {
  const { collectionAddress } = useParams()
  if (!collectionAddress) throw new Error("collectionAddress is required")
  return collectionAddress
}

export default useCollectionAddress
