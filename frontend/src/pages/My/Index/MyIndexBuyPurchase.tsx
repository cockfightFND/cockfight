import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Stack, Text, Flex } from "@mantine/core"
import { formatAmount, truncate } from "@initia/utils"
import type { UserOrdersResponse, Asset, Paginated } from "@initia/marketplace-api-types"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import Icon from "../../../styles/icons/Icon"
import MyIndexItem from "./MyIndexItem"
import FetchNextPage from "../../../components/FetchNextPage"

const MyIndexBuyPurchase = ({ query }: { query: UseInfiniteQueryResult<Paginated<UserOrdersResponse>> }) => {
  const list = query.data?.pages.map((page) => page.data).flat()
  const tokens = list?.map((d) => d.orders).flat()

  const renderDetail = (asset: Asset) => (
    <Text fw={700} tt="uppercase">
      Buy price {formatAmount(asset.amount)} INIT
    </Text>
  )

  const renderCollapsed = (seller: string, updateAt: Date) => (
    <Stack spacing={2}>
      <Text c="mono.3" fz={12} fw={600}>
        From
      </Text>
      <Text fz={16} tt="uppercase">
        {seller.slice(-5)}
      </Text>
      <Flex c="mono.5" gap={4} mt={14}>
        <Icon.Time />
        <Text fz={11} fw={600}>
          {new Date(updateAt).toLocaleString()}
        </Text>
      </Flex>
    </Stack>
  )

  return (
    <Stack>
      {tokens?.map(({ token, fixedPrice, seller, updateAt }, index) => {
        if (!token || !fixedPrice) return null
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
                renderCollapsed={() => renderCollapsed(seller, updateAt)}
              />
            )}
          </WithCollectionInfo>
        )
      })}
      <FetchNextPage {...query} />
    </Stack>
  )
}

export default MyIndexBuyPurchase
