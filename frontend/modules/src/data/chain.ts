import { useQuery } from "@tanstack/react-query"
import { StargateClient } from "@cosmjs/stargate"
import { network } from "../shared"

export const useChainId = () => {
  const rpc = network.rpc
  return useQuery({
    queryKey: ["chainId", rpc],
    queryFn: async () => {
      const client = await StargateClient.connect(rpc)
      return client.getChainId()
    },
  })
}
