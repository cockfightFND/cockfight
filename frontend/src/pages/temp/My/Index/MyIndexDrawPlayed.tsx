import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Stack, Text } from "@mantine/core"
import type { UserDrawResponse, TicketResponse, Paginated } from "@initia/marketplace-api-types"
import DrawHistoryDetail from "../../../components/DrawHistoryDetail"
import MyIndexItem from "./MyIndexItem"
import FetchNextPage from "../../../components/FetchNextPage"

const MyIndexDrawPlayed = ({ query }: { query: UseInfiniteQueryResult<Paginated<UserDrawResponse>> }) => {
  const list = query.data?.pages.map((page) => page.data).flat()

  const renderDetail = (count: number) => <Text fw={700}>PLAYED {count}</Text>

  const renderCollapsed = (
    ticketBuys: { tickets: TicketResponse[]; timestamp: Date }[],
    prizeLastIndex: number,
    isPfp: boolean,
  ) => (
    <>
      {ticketBuys.map(({ tickets, timestamp }, index) => {
        const reorderedTickets = tickets
          .filter((ticket) => ticket.result)
          .sort((a, b) => {
            if (!a.result || !b.result) return -1
            if (a.result.index > b.result.index) return 1
            return -1
          })
          .map((ticket) => {
            if (ticket.result && ticket.result.index < prizeLastIndex) return { ...ticket, prized: true }
            return { ...ticket, prized: false }
          })

        return (
          <DrawHistoryDetail
            py={14}
            tickets={reorderedTickets}
            updateAt={timestamp}
            key={index}
            isPfp={isPfp}
            sx={({ fn }) => ({
              borderBottom: `1px solid ${fn.themeColor("mono.1")}`,
              "&:first-of-type": { paddingTop: 0 },
              "&:last-of-type": { borderBottom: 0, paddingBottom: 0 },
            })}
          />
        )
      })}
    </>
  )

  return (
    <Stack>
      {list?.map(({ pool, ticketBuys }) => (
        <MyIndexItem
          image={pool.mainComponent.token.imageUrl + "/public"}
          backgroundColor={pool.mainComponent.token.backgroundColor}
          meta={`${pool.poolId} | ${pool.collection.name}`}
          title={pool.name}
          key={pool.poolId}
          isPfp={pool.collection.isPfp}
          renderDetail={() => renderDetail(ticketBuys.length)}
          renderCollapsed={() => renderCollapsed(ticketBuys, pool.initialWinPrizeAmount, pool.collection.isPfp)}
        />
      ))}
      <FetchNextPage {...query} />
    </Stack>
  )
}

export default MyIndexDrawPlayed
