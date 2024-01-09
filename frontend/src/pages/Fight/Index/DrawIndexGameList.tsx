import { Stack } from "@mantine/core"
import type { CollectionPoolsResponse } from "@initia/marketplace-api-types"
import { usePaginatedAPI } from "../../../data/api"
import FetchNextPage from "../../../components/FetchNextPage"
import DrawIndexGameItem from "./DrawIndexGameItem"
import ErrorMessage from "../../../components/ErrorMessage"

const DrawIndexGameList = () => {
  const query = usePaginatedAPI<CollectionPoolsResponse>("/draws/collections/pools")
  const { data, error } = query
  const games = data?.pages.map((page) => page.data).flat()

  if (error && error instanceof Error) return <ErrorMessage error={error} />
  if (!games) return null

  return (
    <Stack spacing={16} mt={28}>
      {games.map((game) => (
        <DrawIndexGameItem {...game} key={game.collection.collectionAddress} />
      ))}

      <FetchNextPage {...query} />
    </Stack>
  )
}

export default DrawIndexGameList
