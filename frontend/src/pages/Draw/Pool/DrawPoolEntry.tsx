import { useState } from "react"
import { useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { modals } from "@mantine/modals"
import BigNumber from "bignumber.js"
import axios from "axios"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { bcs } from "@initia/query"
import { TicketStatus } from "@initia/marketplace-api-types"
import type { PoolResponse, TicketResponse } from "@initia/marketplace-api-types"
import { API_URL, MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import { useAPI } from "../../../data/api"
import { useAddress, useBalance, useSignAndBroadcastTxSync } from "../../../data/account"
import { GLOBAL_PADDING } from "../../../styles/variables"
import ErrorModalContent from "../../../components/ErrorModalContent"
import BackButtonBar from "../../../components/BackButtonBar"
import { useHideNavigation } from "../../../app/hooks"
import { DrawPoolEntryProvider } from "./DrawPoolEntryContext"
import DrawIdle from "./DrawIdle"
import DrawLoading from "./DrawLoading"
import DrawSuccess from "./DrawSuccess"
import DrawFailure from "./DrawFailure"

const DrawPoolEntry = () => {
  useHideNavigation()

  const { id } = useParams()
  const { data: pool } = useAPI<PoolResponse>("/draws/pools/by-pool-id/" + id)

  /* context */
  const address = useAddress()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()
  const balance = useBalance()

  /* form */
  const [ticketAmount, setTicketAmount] = useState(0)

  /* submit */
  const { mutate, data, isLoading, isIdle, reset } = useMutation({
    mutationFn: async () => {
      if (!pool) throw new Error("Pool not found")
      const { ticketPrice } = pool

      if (!address) throw new Error("Wallet not connected")
      if (BigNumber(ticketAmount * ticketPrice.amount).gt(balance)) throw new Error("Insufficient balance")

      const drawMessage = {
        typeUrl: "/initia.move.v1.MsgExecute",
        value: MsgExecute.fromPartial({
          sender: address,
          moduleAddress: MARKETPLACE_MODULE_ADDRESS,
          moduleName: "token_draw",
          functionName: "buy_tickets",
          typeArgs: [],
          args: [bcs.ser("u64", id).toBytes(), bcs.ser("u64", ticketAmount).toBytes()],
        }),
      }

      const messages = [drawMessage]
      return await signAndBroadcastTxSync(messages)
    },
    onError: (error) => {
      modals.open({
        title: "Something went wrong",
        children: <ErrorModalContent error={error} />,
        onClose: reset,
      })
    },
  })

  /* polling result */
  const path = "/draws/pools/ticket-result/by-txhash/" + data?.transactionHash
  const resultsQuery = useQuery({
    queryKey: [path],
    queryFn: async () => {
      const { data } = await axios.get<TicketResponse[]>(path, { baseURL: API_URL })
      if (data.length === 0) throw new Error("Not collected yet")
      if (data.some((item) => item.status !== TicketStatus.Executed)) throw new Error("Not executed yet")
      return data
    },
    enabled: !!data,
    retry: true,
    retryDelay: 100,
  })

  /* render */
  const render = (isPfp: boolean) => {
    if (isIdle) return <DrawIdle isPfp={isPfp} />
    if (isLoading || resultsQuery.isLoading) return <DrawLoading isPfp={isPfp} />

    if (resultsQuery.isSuccess) {
      const results = resultsQuery.data.filter((item) => item.result)
      if (results.length) return <DrawSuccess results={results} isPfp={isPfp} />
    }

    return <DrawFailure />
  }

  if (!pool) return null
  const { name, collection } = pool
  const { isPfp } = collection

  return (
    <DrawPoolEntryProvider value={{ pool, ticketAmount, setTicketAmount, submit: mutate }}>
      <BackButtonBar buttonColor="mono.5" m={-GLOBAL_PADDING} mb={0} label={name} />
      {render(isPfp)}
    </DrawPoolEntryProvider>
  )
}

export default DrawPoolEntry
