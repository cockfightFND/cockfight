import { Link } from "react-router-dom"
import { Box, Flex, Group, Image, SimpleGrid, Stack, Text } from "@mantine/core"
import type { Token } from "@initia/marketplace-api-types"
import { truncate } from "@initia/utils"
import useViewMode from "../../../hooks/useViewMode"
import useMultiSelect from "../../../hooks/useMultiSelect"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import AspectImage from "../../../components/AspectImage"
import Check from "../../../components/Check"
import SubmitButton from "../../../components/SubmitButton"
import FixedBottom from "../../../components/FixedBottom"
import DefaultButton from "../../../components/DefaultButton"

const InventoryGameDetailsItemList = ({ tokens, isPfp }: { tokens: Token[]; isPfp?: boolean }) => {
  const collectionAddress = useCollectionAddress()
  const { isGridView, renderViewMode } = useViewMode("list")
  const { selected, getIsSelected, selectItem, renderCheckAll } = useMultiSelect(tokens.map((t) => t.tokenAddress))

  if (!tokens.length) {
    return (
      <Flex h="50vh" justify="center" align="center">
        <Stack align="center" spacing={8}>
          <Text fz={12} fw={600} c="mono.6">
            No items
          </Text>
          <DefaultButton
            invert
            h={36}
            sx={{ borderRadius: 8 }}
            component={Link}
            to={`/market/game/${collectionAddress}`}
          >
            <Text fz={12} fw={700} c="mono.9">
              Go to Market Page
            </Text>
          </DefaultButton>
        </Stack>
      </Flex>
    )
  }

  return (
    <Stack spacing={12} pt={20}>
      <Group position="apart">
        {renderCheckAll()}
        {renderViewMode()}
      </Group>

      <SimpleGrid cols={isGridView ? 4 : 1} spacing={8}>
        {tokens.map(({ tokenAddress, imageUrl, name, backgroundColor }) => (
          <Box
            bg="white"
            pos="relative"
            onClick={() => selectItem(tokenAddress)}
            sx={({ fn }) => ({
              border: `1px solid ${fn.themeColor("mono.1")}`,
              borderRadius: 12,
              cursor: "pointer",
              outline: getIsSelected(tokenAddress) ? `2px solid ${fn.themeColor("mono.9")}` : undefined,
              outlineOffset: -2,
              overflow: "hidden",
            })}
            key={tokenAddress}
          >
            <Check checked={getIsSelected(tokenAddress)} pos="absolute" top={4} left={4} sx={{ zIndex: 1 }} />

            {isGridView ? (
              <AspectImage bg={backgroundColor} src={imageUrl + "/public"} isPfp={isPfp} />
            ) : (
              <Group>
                <Image
                  bg={backgroundColor}
                  src={imageUrl + "/public"}
                  width={68}
                  height={68}
                  sx={{ ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined }}
                />
                <Text fw={700}>{name ?? truncate(tokenAddress)}</Text>
              </Group>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <FixedBottom>
        <Group spacing={8} grow>
          <SubmitButton
            component={Link}
            to="/inventory/create/sell"
            state={{ collectionAddress, tokenAddresses: selected }}
            disabled={selected.length === 0}
          >
            Sell
          </SubmitButton>

          <SubmitButton
            component={Link}
            to="/inventory/create/draw"
            state={{ collectionAddress, tokenAddresses: selected, isPfp }}
            disabled={selected.length === 0 || selected.length > 10}
            ff="Fontdiner Swanky"
          >
            Draw
          </SubmitButton>
        </Group>
      </FixedBottom>
    </Stack>
  )
}

export default InventoryGameDetailsItemList
