import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Flex, Stack, Text } from "@mantine/core"
import { formatAmount, truncate } from "@initia/utils"
import type { UserOrdersResponse, Asset, Trade, Token, Paginated } from "@initia/marketplace-api-types"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import Icon from "../../../styles/icons/Icon"
import MyIndexItem from "./MyIndexItem"
import FetchNextPage from "../../../components/FetchNextPage"

interface MergedTrade extends Trade {
  token?: Token
}

const MyIndexSellSold = ({ query }: { query: UseInfiniteQueryResult<Paginated<UserOrdersResponse>> }) => {
  const list = query.data?.pages.map((page) => page.data).flat()
  const tokens = list
    ?.map((d) => {
      return d.orders
        .map((o) => {
          return o?.trades && o?.trades.length > 0 && o?.trades.map((t) => ({ ...t, token: o.token })).flat()
        })
        .flat()
    })
    .flat()
    .filter((a) => !!a)

  const renderDetail = (asset: Asset) => (
    <Text fw={700} tt="uppercase">
      Sell price {formatAmount(asset.amount)} INIT
    </Text>
  )

  const renderCollapsed = (trade: MergedTrade) => (
    <Stack spacing={2}>
      <Text c="mono.3" fz={12} fw={600}>
        To
      </Text>
      <Text fz={16} c="mono.7" tt="uppercase">
        {trade.buyer.slice(-5)}
      </Text>
      <Flex c="mono.5" mt={14} gap={4}>
        <Icon.Time />
        <Text fz={11} fw={600}>
          {new Date(trade.timestamp).toLocaleString()}
        </Text>
      </Flex>
    </Stack>
  )

  return (
    <Stack>
      {tokens?.map((trade, index) => {
        const { price, token } = trade as MergedTrade
        if (!trade || !token) return null

        return (
          <WithCollectionInfo collectionAddress={token.collectionAddress} key={index}>
            {(collection) => (
              <MyIndexItem
                image={token.imageUrl + "/public"}
                backgroundColor={token.backgroundColor}
                meta={collection?.name}
                title={token.name ?? truncate(token.tokenAddress)}
                isPfp={collection.isPfp}
                renderDetail={() => renderDetail(price)}
                renderCollapsed={() => renderCollapsed(trade)}
              />
            )}
          </WithCollectionInfo>
        )
      })}
      <FetchNextPage {...query} />
    </Stack>
  )
}

export default MyIndexSellSold
