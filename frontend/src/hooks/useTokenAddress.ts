import { useParams } from "react-router-dom"

const useTokenAddress = () => {
  const { collectionAddress, tokenAddress } = useParams()
  if (!(collectionAddress && tokenAddress)) throw new Error("collectionAddress and tokenAddress are required")
  return { collectionAddress, tokenAddress }
}

export default useTokenAddress
