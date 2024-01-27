import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Stack, Text } from "@mantine/core"
import type { DrawStatus, PoolResponse, Paginated } from "@initia/marketplace-api-types"
import MyIndexItem from "./MyIndexItem"
import MyIndexDrawTabContentCollapsed from "./MyIndexDrawTabContentCollapsed"
import FetchNextPage from "../../../components/FetchNextPage"

const MyIndexDrawTabContent = ({
  type,
  query,
}: {
  type: DrawStatus
  query: UseInfiniteQueryResult<Paginated<PoolResponse>>
}) => {
  const list = query.data?.pages.map((page) => page.data).flat()

  const renderDetail = (earned: number) => (
    <Text fw={700} tt="uppercase">
      Earned {earned} INIT
    </Text>
  )

  const renderCollapsed = (pool: PoolResponse) => <MyIndexDrawTabContentCollapsed type={type} pool={pool} />

  return (
    <Stack>
      {list?.map((pool, index) => {
        const {
          mainComponent: { token },
        } = pool
        return (
          <MyIndexItem
            key={index}
            image={token.imageUrl + "/public"}
            backgroundColor={token.backgroundColor}
            meta={`${pool.poolId} | ${pool.collection.name}`}
            title={pool.name}
            isPfp={pool.collection.isPfp}
            renderDetail={() => renderDetail(pool.ticketSold)}
            renderCollapsed={() => renderCollapsed(pool)}
          />
        )
      })}
      <FetchNextPage {...query} />
    </Stack>
  )
}

export default MyIndexDrawTabContent
