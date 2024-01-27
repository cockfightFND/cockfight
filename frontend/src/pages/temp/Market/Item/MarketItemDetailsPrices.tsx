import { Group, Stack, Text } from "@mantine/core"
import type { Order } from "@initia/marketplace-api-types"
import MarketItemDetailsPriceTag from "./MarketItemDetailsPriceTag"

const MarketItemDetailsPrices = ({ fixedPrice, auctionInfo }: Order) => (
  <Group position="apart" mt={24}>
    {fixedPrice && <MarketItemDetailsPriceTag title="Buy Now" price={fixedPrice.amount ?? 0} />}

    {auctionInfo && (
      <Stack spacing={2} ta="right">
        {auctionInfo.highestBid ? (
          <MarketItemDetailsPriceTag title="Current Bid" price={auctionInfo.highestBid.amount} />
        ) : (
          <MarketItemDetailsPriceTag title="Start price" price={auctionInfo.startPrice.amount} />
        )}

        <Text c="mono.5" fz={11} fw={600}>
          {new Date(auctionInfo.expiration).toLocaleString()}
        </Text>
      </Stack>
    )}
  </Group>
)

export default MarketItemDetailsPrices
