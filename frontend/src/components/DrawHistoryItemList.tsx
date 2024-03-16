import { partition } from "ramda"
import { Box, Group, Image, Stack, Text } from "@mantine/core"
import type { DrawCount, TicketResponse } from "@initia/marketplace-api-types"
import { truncate } from "../../utils/format"
import { useIsDrawMenu } from "../styles/colorScheme"
import PrizeIcon from "./PrizeIcon"

interface Ticket extends TicketResponse {
  prized?: boolean
}

interface Props {
  totalItems: Ticket[]
  prizeCount?: DrawCount
  isPfp?: boolean
}

const DrawHistoryItemList = ({ totalItems, prizeCount, isPfp }: Props) => {
  const isDrawMenu = useIsDrawMenu()

  const [prizeItems, lowTierItems] = partition(({ result }) => {
    if (!result || !prizeCount) return false
    return result.index < prizeCount.total
  }, totalItems)

  const render = (items: Ticket[], prize?: boolean) => {
    if (!items.length) return null
    return (
      <Stack spacing={12}>
        {prizeCount && (
          <Text c="mono.4" fz={12} fw={800} tt="uppercase">
            {prize ? "Prize " : "Low tier "} {items.length}
            <Text span tt="lowercase">
              x
            </Text>
          </Text>
        )}

        <Stack spacing={20}>
          {items.map((ticket, index) => {
            if (!ticket.result) return null
            return (
              <Group key={index} spacing={12} miw={0} noWrap>
                <Box pos="relative">
                  <Image
                    bg={ticket.result.token.backgroundColor}
                    src={ticket.result.token.imageUrl + "/public"}
                    width={32}
                    height={32}
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                    }}
                  />
                  {prize && (
                    <Box sx={{ position: "absolute", bottom: 0, right: 0, transform: "translate(50%, 30%)" }}>
                      <PrizeIcon />
                    </Box>
                  )}
                  {ticket?.prized && (
                    <Box sx={{ position: "absolute", bottom: 0, right: 0, transform: "translate(50%, 30%)" }}>
                      <PrizeIcon iconColor="mono.9" iconBgColor="white" />
                    </Box>
                  )}
                </Box>
                <Text c={isDrawMenu ? "mono.2" : "mono.8"} fz={12}>
                  {ticket.result.token.name ?? truncate(ticket.result.token.tokenAddress)}
                </Text>
              </Group>
            )
          })}
        </Stack>
      </Stack>
    )
  }

  return prizeCount ? (
    <Stack spacing={20}>
      {render(prizeItems, true)}
      {render(lowTierItems)}
    </Stack>
  ) : (
    render(totalItems)
  )
}

export default DrawHistoryItemList
