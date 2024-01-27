import { Box, Flex, Group, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import type { CollectionResponse } from "@initia/marketplace-api-types"
import Icon from "../../../styles/icons/Icon"
import CircleImage from "../../../components/CircleImage"

const InventoryIndexGameItem = ({ name, thumbnailUrl, collectionAddress }: CollectionResponse) => {
  return (
    <Box
      component={Link}
      to={`./game/${collectionAddress}`}
      bg="white"
      p={20}
      sx={{ borderRadius: 12, boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <Group position="apart" noWrap>
        <Group spacing={12} noWrap>
          {/* <CircleImage src={thumbnailUrl + "/public"} width={40} height={40} border="2px solid black" />  */}
          <Text>{name}</Text>
        </Group>

        <Flex c="mono.5">
          <Icon.ChevronRight />
        </Flex>
      </Group>
    </Box>
  )
}

export default InventoryIndexGameItem
