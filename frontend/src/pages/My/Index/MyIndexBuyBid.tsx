import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Stack, Text } from "@mantine/core"
import BigNumber from "bignumber.js"
import type { Order, Paginated } from "@initia/marketplace-api-types"
import { formatAmount } from "@initia/utils"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import MyIndexItem from "./MyIndexItem"
import MyIndexBuyBidCollapsed from "./MyIndexBuyBidCollapsed"
import FetchNextPage from "../../../components/FetchNextPage"

const MyIndexBuyBid = ({ query }: { query: UseInfiniteQueryResult<Paginated<Order>> }) => {
  const list = query.data?.pages.map((page) => page.data).flat()

  const renderDetail = (order: Order) => {
    const myBid = order?.auctionInfo?.bids?.[0]
    const highestBid = order?.auctionInfo?.highestBid

    const isOpen = order?.status === "OPEN"
    const isHighest = !!(myBid && highestBid) && BigNumber(myBid.bidAmount.amount).gte(highestBid.amount)

    const contents = (() => {
      switch (true) {
        case isHighest:
          return { description: `Price ${formatAmount(order?.fixedPrice?.amount)} INIT`, color: "mono.7" }
        case isOpen && !isHighest:
          return { description: "Outbidded", color: "danger" }
        case !isOpen && !isHighest:
          return { description: "Failed", color: "mono.5" }
        default:
          return { description: "", color: "mono.7" }
      }
    })()

    return (
      <Text fw={700} tt="uppercase" c={contents.color}>
        {contents.description}
      </Text>
    )
  }

  const renderCollapsed = (
    order: Order,
    collectionAddress: string,
    tokenAddress: string,
    collectionName: string | null,
  ) => (
    <MyIndexBuyBidCollapsed
      order={order}
      collectionAddress={collectionAddress}
      tokenAddress={tokenAddress}
      collectionName={collectionName}
    />
  )

  return (
    <Stack>
      {list?.map(({ token, ...order }, index) => {
        if (!token) return null
        return (
          <WithCollectionInfo collectionAddress={token.collectionAddress} key={index}>
            {({ name = "", isPfp }) => (
              <MyIndexItem
                image={token.imageUrl + "/public"}
                backgroundColor={token.backgroundColor}
                meta={name}
                title={token.name}
                isPfp={isPfp}
                renderDetail={() => renderDetail(order)}
                renderCollapsed={() => renderCollapsed(order, token.collectionAddress, token.tokenAddress, name)}
              />
            )}
          </WithCollectionInfo>
        )
      })}
      <FetchNextPage {...query} />
    </Stack>
  )
}

export default MyIndexBuyBid
