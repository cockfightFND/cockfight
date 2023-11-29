import { Drawer, Flex, Image, Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import type { TicketResponse } from "@initia/marketplace-api-types"
import ConfettiExplosion from "react-confetti-explosion"
import Icon from "../../../styles/icons/Icon"
import Container from "../../../components/Container"
import DrawHistoryItemList from "../../../components/DrawHistoryItemList"
import { DRAW_POOL_CARD_RADIUS, DRAW_POOL_CARD_SIZE, DRAW_POOL_MARGIN_TOP } from "./card"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import DrawButtons from "./DrawButtons"

const DrawSuccess = ({ results, isPfp }: { results: TicketResponse[]; isPfp: boolean }) => {
  const { ticketAmount, pool } = useDrawPoolEntry()
  const [showDrawResultDetails, { open, close }] = useDisclosure(false)
  const { colors } = useMantineTheme()

  const { prizeCount } = pool

  if (!results[0].result) throw new Error()
  const { token } = results[0].result
  const { imageUrl, backgroundColor } = token

  return (
    <Stack spacing={60} align="center" mt={DRAW_POOL_MARGIN_TOP}>
      <Stack align="center" spacing={14}>
        <ConfettiExplosion force={1} particleSize={16} duration={3000} colors={colors["brand"]} />

        <Image
          src={imageUrl + "/public"}
          bg={backgroundColor}
          sx={{
            borderRadius: DRAW_POOL_CARD_RADIUS,
            overflow: "hidden",
            ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
          }}
          width={DRAW_POOL_CARD_SIZE}
          height={DRAW_POOL_CARD_SIZE}
        />

        <UnstyledButton c="mono.5" fz={12} fw={600} onClick={open}>
          <Flex align="center">
            <Text tt="uppercase">
              You got{" "}
              <Text c="mono.3" span>
                {results.length} items
              </Text>
            </Text>
            <Icon.ChevronRight width={12} height={12} />
          </Flex>
        </UnstyledButton>
      </Stack>

      <DrawButtons title="Want to get more?" />

      <Drawer
        opened={showDrawResultDetails}
        onClose={close}
        sx={({ fn }) => ({
          ".mantine-Drawer-header": { background: fn.themeColor("mono.9") },
          ".mantine-Drawer-content": { background: fn.themeColor("mono.9") },
        })}
      >
        <Container>
          <Text c="mono.1" fz={14} fw={600} mb={20}>
            <Text span tt="uppercase">
              Draw
            </Text>{" "}
            {ticketAmount}x{" "}
            <Text c="mono.3" span>
              and got{" "}
            </Text>{" "}
            {results.length}{" "}
            <Text c="mono.3" span>
              items
            </Text>
          </Text>
          <DrawHistoryItemList totalItems={results} prizeCount={prizeCount} isPfp={pool.collection.isPfp} />
        </Container>
      </Drawer>
    </Stack>
  )
}

export default DrawSuccess
