import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Flex, Stack, Text } from "@mantine/core"
import type { UserOrdersResponse, Paginated } from "@initia/marketplace-api-types"
import { truncate } from "@initia/utils"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import Icon from "../../../styles/icons/Icon"
import MyIndexItem from "./MyIndexItem"
import FetchNextPage from "../../../components/FetchNextPage"

const MyIndexSellCanceled = ({ query }: { query: UseInfiniteQueryResult<Paginated<UserOrdersResponse>> }) => {
  const list = query.data?.pages.map((page) => page.data).flat()

  const renderDetail = () => (
    <Text fw={700} c="mono.5" tt="uppercase">
      Canceled
    </Text>
  )

  const renderCollapsed = (updateAt: Date) => {
    return (
      <Flex c="mono.5" gap={4}>
        <Icon.Time />
        <Text fz={11} fw={600}>
          Canceled on {new Date(updateAt).toLocaleString()}
        </Text>
      </Flex>
    )
  }

  return (
    <Stack>
      {list?.map(({ orders }, index) => {
        const [{ token, fixedPrice, updateAt }] = orders
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
                renderDetail={() => renderDetail()}
                renderCollapsed={() => renderCollapsed(updateAt)}
              />
            )}
          </WithCollectionInfo>
        )
      })}
      <FetchNextPage {...query} />
    </Stack>
  )
}

export default MyIndexSellCanceled
