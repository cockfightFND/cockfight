import { Box, Group, Image, Modal, Stack, Text, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { formatAmount, formatPercent } from "@initia/utils"
import { Num } from "@initia/react-components"
import Icon from "../../../styles/icons/Icon"
import { DRAW_POOL_CARD_RADIUS } from "./card"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import DrawButtons from "./DrawButtons"
import DrawPoolDetails from "./DrawPoolDetails"

const DrawIdle = ({ isPfp }: { isPfp: boolean }) => {
  const [opened, { open, close }] = useDisclosure()
  const { pool } = useDrawPoolEntry()
  const { mainComponent, winProbability } = pool
  const { token } = mainComponent

  return (
    <>
      <Stack spacing={0} align="center" pt={12} pos="relative">
        <Box
          sx={{
            borderRadius: DRAW_POOL_CARD_RADIUS,
            boxShadow: `0px 12px 36px 0px #00000040, 0px 10px 6px 0px #00000026`,
          }}
        >
          <Stack
            w={260}
            h={330}
            p={20}
            spacing={10}
            bg="white"
            sx={{
              borderRadius: DRAW_POOL_CARD_RADIUS,
              boxShadow: `0px -1px 4px 0px #00000040 inset, 0px 2px 5px 0px #FFFFFF40 inset`,
            }}
          >
            <Image
              src={token.imageUrl + "/public"}
              bg={token.backgroundColor}
              sx={({ fn }) => ({
                borderRadius: 12,
                overflow: "hidden",
                ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                border: `1px solid ${fn.themeColor("mono.1")}`,
              })}
              width={220}
              height={220}
            />
            <Text c="mono.5" fz={12} mt={6}>
              {pool.name} #{pool.poolId}
            </Text>
            <Group position="apart" align="center">
              <Group spacing={2} c="black" fw={400} ff="Fugaz One" align="baseline">
                <Num
                  amount={formatAmount(pool.ticketPrice.amount)}
                  decimals={0}
                  fixedByAmount
                  size={16}
                  decimalSize={12}
                />
                <Text fz={12} ff="Fugaz One">
                  INIT
                </Text>
              </Group>
              <Group c="black" spacing={2}>
                <Icon.Dice width={12} height={12} />
                <Text fz={10} tt="uppercase">
                  {formatPercent(winProbability)}
                </Text>
              </Group>
            </Group>
          </Stack>
        </Box>

        <Stack align="center" mt={20} w="100%">
          <UnstyledButton display="inline-block" c="purple.1" fz={11} fw={600} onClick={open}>
            <Text td="underline">Shuffle Detail</Text>
          </UnstyledButton>
        </Stack>

        <Modal
          opened={opened}
          onClose={close}
          fullScreen
          sx={({ fn }) => ({
            ".mantine-Modal-header": { background: fn.themeColor("purple.0") },
            ".mantine-Modal-content": { background: fn.themeColor("purple.0"), color: "white" },
          })}
        >
          <DrawPoolDetails />
        </Modal>
      </Stack>
      <DrawButtons />
    </>
  )
}

export default DrawIdle
