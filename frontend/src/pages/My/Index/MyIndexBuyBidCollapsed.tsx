import { Flex, Stack, SimpleGrid, Text, Button, Divider, Drawer, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import type { Order } from "@initia/marketplace-api-types"
import { formatAmount } from "@initia/utils"
import BigNumber from "bignumber.js"
import MarketItemBid from "../../Market/Item/MarketItemBid"
import MarketItemBuy from "../../Market/Item/MarketItemBuy"
import Container from "../../../components/Container"
import WithTokenDetails from "../../../components/WithTokenDetails"
import Icon from "../../../styles/icons/Icon"

interface Props {
  order: Order
  collectionAddress: string
  tokenAddress: string
  collectionName: string | null
}

const MyIndexBuyBidCollapsed = ({ order, collectionAddress, tokenAddress, collectionName }: Props) => {
  const [isBuyOpened, { open: openBuy, close: closeBuy }] = useDisclosure(false)
  const [isBidOpened, { open: openBid, close: closeBid }] = useDisclosure(false)

  const myBid = order?.auctionInfo?.bids?.[0]
  const highestBid = order?.auctionInfo?.highestBid

  const isOpen = order?.status === "OPEN"
  const isHighest = !!(myBid && highestBid) && BigNumber(myBid.bidAmount.amount).gte(highestBid.amount)

  const renderButton = () => {
    if (isHighest)
      return (
        <Button color="mono.0" c="mono.9" fz={12} fw={700} mt={10} onClick={openBuy}>
          Buy now
        </Button>
      )

    return (
      <Button.Group
        sx={({ fn }) => ({
          marginTop: 10,
          justifyContent: "space-around",
          backgroundColor: fn.themeColor("mono.0"),
          borderRadius: 8,
          button: { flex: 1 },
          fontWeight: 700,
        })}
      >
        <Button color="mono.0" c="mono.9" fz={12} onClick={openBid}>
          Bid again
        </Button>
        <Divider orientation="vertical" color="mono.2" my={10} />
        <Button color="mono.0" c="mono.9" fz={12} onClick={openBuy}>
          Buy now
        </Button>
      </Button.Group>
    )
  }

  return (
    <Stack spacing={0} fw={600}>
      <SimpleGrid cols={2} spacing={2} mb={16}>
        {!isHighest && isOpen ? (
          <>
            <Stack spacing={2}>
              <Text c="mono.3" fz={12}>
                Price
              </Text>
              <Flex align="baseline" gap={2} c="mono.7">
                <Text fz={16}>{formatAmount(order?.fixedPrice?.amount)}</Text>
                <Text fz={12}>INIT</Text>
              </Flex>
            </Stack>
            <Stack spacing={2}>
              <Text c="mono.3" fz={12}>
                Top Bid
              </Text>
              <Flex align="baseline" gap={2}>
                <Text fz={16}>{formatAmount(highestBid?.amount)}</Text>
                <Text fz={12}>INIT</Text>
              </Flex>
            </Stack>
          </>
        ) : (
          <Stack spacing={2}>
            <Text c="mono.3" fz={12}>
              My Bid
            </Text>
            <Flex align="baseline" gap={2} c="mono.7">
              <Text fz={16} strikethrough={!isOpen && !isHighest}>
                {formatAmount(myBid?.bidAmount.amount)}
              </Text>
              <Text fz={12}>INIT</Text>
            </Flex>
          </Stack>
        )}
      </SimpleGrid>

      <Flex c="mono.5" gap={4}>
        <Icon.Time />

        {order?.auctionInfo?.expiration && (
          <Text fz={11}>
            {isOpen ? "Will end on " : ""} {new Date(order.auctionInfo.expiration).toLocaleString()}
          </Text>
        )}
      </Flex>

      {isOpen && renderButton()}

      <WithTokenDetails collectionAddress={collectionAddress} tokenAddress={tokenAddress}>
        {(token) =>
          !!token.orders?.length && (
            <>
              <Modal opened={isBidOpened} onClose={closeBid} title="Place a bid" fullScreen>
                <Container>
                  <MarketItemBid {...token} name={collectionName} onFinish={closeBid} />
                </Container>
              </Modal>
              <Drawer opened={isBuyOpened} onClose={closeBuy} title="Buy">
                <Container>
                  <MarketItemBuy {...token} name={collectionName} onFinish={closeBuy} />
                </Container>
              </Drawer>
            </>
          )
        }
      </WithTokenDetails>
    </Stack>
  )
}

export default MyIndexBuyBidCollapsed
