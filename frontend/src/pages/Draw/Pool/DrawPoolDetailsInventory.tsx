import { useMemo } from "react"
import { Group, Image, Stack, Text, Box } from "@mantine/core"
import type { DrawPooolComponent } from "@initia/marketplace-api-types"
import { truncate } from "@initia/utils"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import PrizeIcon from "../../../components/PrizeIcon"

const DrawPoolDetailsInventory = ({ isPfp }: { isPfp: boolean }) => {
  const { pool } = useDrawPoolEntry()
  const { components, prizeCount, totalCount } = pool

  const sortItemsFn = (prev: DrawPooolComponent, curr: DrawPooolComponent) =>
    Number(prev.isDrawn) - Number(curr.isDrawn)

  const prizeComponents = useMemo(() => {
    return components?.slice(0, prizeCount?.total).sort(sortItemsFn)
  }, [components, prizeCount])

  const lowComponents = useMemo(() => {
    return components?.slice(prizeCount?.total).sort(sortItemsFn)
  }, [components, prizeCount])

  return (
    <Stack spacing={24}>
      <Group position="apart">
        <Text fz={12} fw={800} tt="uppercase">
          Prize
        </Text>
        {prizeCount && (
          <Text fz={12} fw={800}>
            <Text span>{prizeCount.remain}</Text>
            <Text c="mono.5" span>
              /{prizeCount.total}
            </Text>
          </Text>
        )}
      </Group>

      <Stack spacing={20}>
        {prizeComponents?.map(({ isDrawn, token: { tokenAddress, backgroundColor, imageUrl, name } }) => (
          <Group
            key={tokenAddress}
            opacity={isDrawn ? 0.5 : 1}
            pb={20}
            sx={({ fn }) => ({
              borderBottom: `1px solid ${fn.themeColor("mono.8")}`,
              "&:last-of-type": {
                borderBottom: 0,
                paddingBottom: 0,
              },
            })}
          >
            <Box pos="relative">
              <Image
                bg={backgroundColor}
                src={imageUrl + "/public"}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                }}
                width={36}
                height={36}
              />
              <Box sx={{ position: "absolute", bottom: 0, right: 0, transform: "translate(50%, 30%)" }}>
                <PrizeIcon />
              </Box>
            </Box>
            <Text fz={14}>{name ?? truncate(tokenAddress)}</Text>
          </Group>
        ))}
      </Stack>

      <Group position="apart" mt={40}>
        <Text fz={12} fw={800} tt="uppercase">
          Low tier
        </Text>
        {prizeCount && totalCount && (
          <Text fz={12} fw={800}>
            <Text span>{totalCount.remain - prizeCount.remain}</Text>
            <Text c="mono.5" span>
              /{totalCount.total - prizeCount.total}
            </Text>
          </Text>
        )}
      </Group>

      <Stack spacing={20}>
        {lowComponents?.map(({ isDrawn, token: { tokenAddress, backgroundColor, imageUrl, name } }) => (
          <Group
            key={tokenAddress}
            opacity={isDrawn ? 0.5 : 1}
            pb={20}
            sx={({ fn }) => ({
              borderBottom: `1px solid ${fn.themeColor("mono.8")}`,
              "&:last-of-type": {
                borderBottom: 0,
                paddingBottom: 0,
              },
            })}
          >
            <Image
              bg={backgroundColor}
              src={imageUrl + "/public"}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
              }}
              width={36}
              height={36}
            />
            <Text>{name ?? truncate(tokenAddress)}</Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  )
}

export default DrawPoolDetailsInventory
