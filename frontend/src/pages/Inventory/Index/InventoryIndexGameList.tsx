import { Link } from "react-router-dom"
import { Flex, Stack, Text } from "@mantine/core"
import type { CollectionResponse } from "@initia/marketplace-api-types"
import { useAPI } from "../../../data/api"
import InventoryIndexGameItem from "./InventoryIndexGameItem"
import DefaultButton from "../../../components/DefaultButton"

const InventoryIndexGameList = () => {
  const { data } = useAPI<CollectionResponse[]>("/collections")

  const renderEmpty = () => (
    <Flex h="50vh" justify="center" align="center">
      <Stack align="center" spacing={8}>
        <Text fz={12} fw={600} c="mono.6">
          No items
        </Text>
        <DefaultButton invert h={36} sx={{ borderRadius: 8 }} component={Link} to={`/market`}>
          <Text fz={12} fw={700} c="mono.9">
            Go to Market Page
          </Text>
        </DefaultButton>
      </Stack>
    </Flex>
  )

  const render = () => {
    if (!data?.length) return renderEmpty()

    return data.map((game) => <InventoryIndexGameItem {...game} key={game.collectionAddress} />)
  }

  return <Stack spacing={12}>{render()}</Stack>
}

export default InventoryIndexGameList
