import { Box, Group, Stack, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import { formatAmount, formatPercent } from "@initia/utils"
import type { PoolResponse } from "@initia/marketplace-api-types"
import Icon from "../styles/icons/Icon"
import AspectImage from "./AspectImage"

interface Props extends PoolResponse {
  isPfp?: boolean
}

const DrawSummary = (pool: Props) => {
  const { poolId, name, mainComponent, ticketPrice, winProbability, isPfp } = pool
  const { token } = mainComponent

  return (
    <Box component={Link} to={"/draw/pool/" + poolId} bg="mono.8" sx={{ borderRadius: 12, overflow: "hidden" }}>
      <AspectImage bg={token.backgroundColor} src={token.imageUrl + "/public"} isPfp={isPfp} />

      <Stack spacing={8} p={12}>
        <Group position="apart" fz={12} fw={600}>
          <Group c="brand" spacing={2}>
            <Icon.Dice width={14} height={14} />
            <Text>{formatPercent(winProbability)}</Text>
          </Group>

          <Text c="mono.5">ID {poolId}</Text>
        </Group>

        <Text>{name}</Text>
        <Text c="mono.5" fz={12} fw={600}>
          {formatAmount(ticketPrice.amount)} INIT
        </Text>
      </Stack>
    </Box>
  )
}

export default DrawSummary
