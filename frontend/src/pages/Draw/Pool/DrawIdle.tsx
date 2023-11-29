import { Group, Image, Modal, Stack, Text, Progress, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { formatPercent } from "@initia/utils"
import Icon from "../../../styles/icons/Icon"
import { DRAW_POOL_CARD_RADIUS, DRAW_POOL_CARD_SIZE, DRAW_POOL_MARGIN_TOP } from "./card"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import DrawButtons from "./DrawButtons"
import DrawPoolDetails from "./DrawPoolDetails"

const DrawIdle = ({ isPfp }: { isPfp: boolean }) => {
  const [opened, { open, close }] = useDisclosure()

  const { pool } = useDrawPoolEntry()
  const { mainComponent, winProbability, prizeCount } = pool
  const { token } = mainComponent

  const prizeDrawRatio = prizeCount ? ((prizeCount.total - prizeCount.remain) / prizeCount.total) * 100 : 0

  return (
    <Stack spacing={0} align="center" pt={DRAW_POOL_MARGIN_TOP} pos="relative">
      <Group c="brand" spacing={4} pos="absolute" top={0}>
        <Icon.Dice />
        <Text fz={12} tt="uppercase">
          Probability {formatPercent(winProbability)}
        </Text>
      </Group>

      <Image
        src={token.imageUrl + "/public"}
        bg={token.backgroundColor}
        sx={{
          borderRadius: DRAW_POOL_CARD_RADIUS,
          overflow: "hidden",
          ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
        }}
        width={DRAW_POOL_CARD_SIZE}
        height={DRAW_POOL_CARD_SIZE}
      />

      <Stack spacing={8} mt={54} mb={90} px={16} w="100%">
        <Progress
          value={prizeDrawRatio}
          color="brand"
          styles={({ fn }) => ({
            root: { height: 3, borderRadius: 0, backgroundColor: fn.themeColor("mono.8") },
            bar: { borderRadius: "0 !important" },
          })}
        />
        <Group position="apart">
          <Text fz={11} fw={600} tt="uppercase" c="mono.5">
            {prizeCount && (
              <>
                Prizes
                <Text span c="mono.1" ml={4}>
                  {prizeCount.remain}
                </Text>
                /{prizeCount && prizeCount.total}
              </>
            )}
          </Text>
          <UnstyledButton display="inline-block" c="mono.5" fz={11} fw={600} tt="uppercase" onClick={open}>
            <Group spacing={0}>
              <Text>Draw Detail</Text>
              <Icon.ChevronRight width={10} height={10} />
            </Group>
          </UnstyledButton>
        </Group>
      </Stack>

      <DrawButtons title="How many will you draw?" />

      <Modal
        opened={opened}
        onClose={close}
        fullScreen
        sx={{
          ".mantine-Modal-header": { background: "black" },
          ".mantine-Modal-content": { background: "black", color: "white" },
        }}
      >
        <DrawPoolDetails />
      </Modal>
    </Stack>
  )
}

export default DrawIdle
