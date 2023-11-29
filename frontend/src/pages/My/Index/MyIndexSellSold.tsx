import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Flex, Stack, Text } from "@mantine/core"
import { formatAmount, truncate } from "@initia/utils"
import type { UserOrdersResponse, Asset, Trade, Paginated } from "@initia/marketplace-api-types"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import Icon from "../../../styles/icons/Icon"
import MyIndexItem from "./MyIndexItem"
import FetchNextPage from "../../../components/FetchNextPage"

const MyIndexSellSold = ({ query }: { query: UseInfiniteQueryResult<Paginated<UserOrdersResponse>> }) => {
  const list = query.data?.pages.map((page) => page.data).flat()

  const renderDetail = (asset: Asset) => (
    <Text fw={700} tt="uppercase">
      Sell price {formatAmount(asset.amount)} INIT
    </Text>
  )

  const renderCollapsed = (trade: Trade) => (
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
      {list?.map(({ orders }, index) => {
        const [{ token, fixedPrice, trades }] = orders
        if (!token || !fixedPrice || !trades?.length) return null
        const [trade] = trades

        return (
          <WithCollectionInfo collectionAddress={token.collectionAddress} key={index}>
            {(collection) => (
              <MyIndexItem
                image={token.imageUrl + "/public"}
                backgroundColor={token.backgroundColor}
                meta={collection?.name}
                title={token.name ?? truncate(token.tokenAddress)}
                isPfp={collection.isPfp}
                renderDetail={() => renderDetail(fixedPrice)}
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
