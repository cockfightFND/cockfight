import { useQuery, useQueryClient } from "@tanstack/react-query"
import { atom, useRecoilValue, useSetRecoilState } from "recoil"
import { lcd } from "./env"

export const latestTxHashState = atom({
  key: "latestTxHash",
  default: "",
})

export const isBroadcastingState = atom({
  key: "isBroadcasting",
  default: false,
})

export const useLatestTxHash = () => {
  const txhash = useRecoilValue(latestTxHashState)
  return txhash
}

export const useSetLatestTxHash = () => {
  const setLatestTx = useSetRecoilState(latestTxHashState)
  return (txhash: string) => setLatestTx(txhash)
}

export const useTxInfo = (txhash: string) => {
  const setIsBroadcasting = useSetRecoilState(isBroadcastingState)
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["tx.txInfo", txhash],
    queryFn: () => lcd.tx.txInfo(txhash),
    enabled: !!txhash,
    retry: true,
    retryDelay: 1000,
    onSettled: () => setIsBroadcasting(false),
    onSuccess: () => queryClient.invalidateQueries(),
  })
}
