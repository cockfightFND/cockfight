import { Stack, Text } from "@mantine/core"
import { formatAmount } from "@initia/utils"

const MarketItemDetailsPriceTag = ({ title, price }: { title: string; price: number }) => {
  return (
    <Stack spacing={4}>
      <Text c="mono.5" fz={12} fw={600}>
        {title}
      </Text>

      <Text fz={22}>
        {formatAmount(price)}
        <Text fz={14} span>
          INIT
        </Text>
      </Text>
    </Stack>
  )
}

export default MarketItemDetailsPriceTag
