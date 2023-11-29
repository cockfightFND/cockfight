import { Box, Stack, Text, Flex } from "@mantine/core"
import type { Trait } from "@initia/marketplace-api-types"
import Icon from "../../../styles/icons/Icon"

const MarketItemDetailsTraits = ({ traits }: { traits: Trait[] }) => {
  return (
    <Stack spacing={20}>
      <Flex align="center" gap={6}>
        <Icon.ListCard width={18} height={18} />
        <Text fw={800} tt="uppercase">
          Trait {traits.length > 0 && `(${traits.length})`}
        </Text>
      </Flex>

      <Stack spacing={12}>
        {traits.map(({ traitType, value }) => (
          <Box
            bg="white"
            p={16}
            sx={{ borderRadius: 12, boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)" }}
            key={traitType}
          >
            <Text c="mono.5" fz={12} fw={600}>
              {traitType}
            </Text>
            <Text fw={800}>{value}</Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

export default MarketItemDetailsTraits
