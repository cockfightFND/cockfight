import { Group, SimpleGrid, Stack, Text, UnstyledButton } from "@mantine/core"
import { Link } from "react-router-dom"
import type { CollectionPoolsResponse } from "@initia/marketplace-api-types"
import Icon from "../../../styles/icons/Icon"
import DrawSummary from "../../../components/DrawSummary"
import CircleImage from "../../../components/CircleImage"

const DrawIndexGameItem = ({ collection, pools }: CollectionPoolsResponse) => {
  const { name, collectionAddress, thumbnailUrl, isPfp } = collection

  return (
    <Stack spacing={20} bg="mono.9" sx={{ borderRadius: 20 }} px={20} py={28}>
      <UnstyledButton c="mono.1" component={Link} to={"./game/" + collectionAddress}>
        <Group position="apart">
          <Group spacing={12}>
            <CircleImage
              src={thumbnailUrl + "/public"}
              width={36}
              height={36}
              border={({ fn }) => `1px solid ${fn.themeColor("mono.2")}`}
            />
            <Text>{name}</Text>
          </Group>

          <Text c="gray.5">
            <Icon.ChevronRight />
          </Text>
        </Group>
      </UnstyledButton>

      <SimpleGrid cols={2} spacing={16}>
        {pools.map((pool, index) => (
          <DrawSummary {...pool} isPfp={isPfp} key={index} />
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default DrawIndexGameItem
