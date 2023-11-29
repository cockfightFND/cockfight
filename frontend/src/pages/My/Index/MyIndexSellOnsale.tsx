import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Stack, Text } from "@mantine/core"
import { formatAmount, truncate } from "@initia/utils"
import type { UserOrdersResponse, Asset, Token, Order, Paginated } from "@initia/marketplace-api-types"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import MyIndexItem from "./MyIndexItem"
import MyIndexSellOnsaleCollapsed from "./MyIndexSellOnsaleCollapsed"
import FetchNextPage from "../../../components/FetchNextPage"

const MyIndexSellOnsale = ({ query }: { query: UseInfiniteQueryResult<Paginated<UserOrdersResponse>> }) => {
  const list = query.data?.pages.map((page) => page.data).flat()
  const tokens = list?.map((d) => d.orders).flat()

  const renderDetail = (asset: Asset) => (
    <Text fw={700} tt="uppercase">
      Price {formatAmount(asset.amount)} INIT
    </Text>
  )

  const renderCollapsed = (token: Token, order: Order, name: string | null) => (
    <MyIndexSellOnsaleCollapsed token={token} order={order} collectionName={name} />
  )

  return (
    <Stack>
      {tokens?.map((order, index) => {
        const { token, fixedPrice } = order
        if (!token || !fixedPrice) return null

        return (
          <WithCollectionInfo collectionAddress={token.collectionAddress} key={index}>
            {({ name = "", isPfp }) => (
              <MyIndexItem
                image={token.imageUrl + "/public"}
                backgroundColor={token.backgroundColor}
                meta={name}
                title={token.name ?? truncate(token.tokenAddress)}
                isPfp={isPfp}
                renderDetail={() => renderDetail(fixedPrice)}
                renderCollapsed={() => renderCollapsed(token, order, name)}
              />
            )}
          </WithCollectionInfo>
        )
      })}
      <FetchNextPage {...query} />
    </Stack>
  )
}

export default MyIndexSellOnsale
