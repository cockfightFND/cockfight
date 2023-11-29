import { Stack, Flex, Text, Button, Divider, Drawer } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { formatAmount } from "@initia/utils"
import type { Token, Order } from "@initia/marketplace-api-types"
import Container from "../../../components/Container"
import Icon from "../../../styles/icons/Icon"
import MyIndexSellItemCancel from "./MyIndexSellItemCancel"
import MyIndexSellItemAcceptBid from "./MyIndexSellItemAcceptBid"

interface Props {
  token: Token
  order: Order
  collectionName: string | null
}

const MyIndexSellOnsaleCollapsed = ({ token, order, collectionName }: Props) => {
  const [isCancelOpened, { open: openCancel, close: closeCancel }] = useDisclosure(false)
  const [isAcceptOpened, { open: openAccept, close: closeAccept }] = useDisclosure(false)

  const isAuction = !!order?.auctionInfo

  return (
    <Stack spacing={16}>
      {isAuction && (
        <Stack spacing={2}>
          <Text c="mono.3" fz={12} fw={600}>
            {order?.auctionInfo?.highestBid ? "Top" : "Start"} bid
          </Text>
          <Flex align="baseline" gap={2} c="mono.7">
            <Text fz={16}>
              {formatAmount(
                order?.auctionInfo?.highestBid
                  ? order.auctionInfo.highestBid.amount
                  : order.auctionInfo?.startPrice.amount,
              )}
            </Text>
            <Text fz={12}>INIT</Text>
          </Flex>
        </Stack>
      )}
      <Stack spacing={10}>
        {isAuction && (
          <Flex c="mono.5" gap={4}>
            <Icon.Time />
            <Text fz={11} fw={600}>
              Will end on {new Date(order?.auctionInfo?.expiration || "").toLocaleString()}
            </Text>
          </Flex>
        )}
        <Button.Group
          sx={({ fn }) => ({
            marginTop: isAuction ? 10 : 0,
            justifyContent: "space-around",
            backgroundColor: fn.themeColor("mono.0"),
            borderRadius: 8,
            button: { flex: 1 },
            fontWeight: 700,
          })}
        >
          <Button color="mono.0" c="mono.9" fz={12} onClick={openCancel}>
            Cancel order
          </Button>

          {isAuction && (
            <>
              <Divider orientation="vertical" color="mono.2" my={10} />
              <Button color="mono.0" c="mono.9" fz={12} onClick={openAccept} disabled={!order.auctionInfo?.highestBid}>
                Accept bid
              </Button>
            </>
          )}
        </Button.Group>
      </Stack>

      <Drawer opened={isCancelOpened} onClose={closeCancel} title="Cancel order">
        <Container>
          <MyIndexSellItemCancel {...token} orderId={order.orderId} name={collectionName} onFinish={closeCancel} />
        </Container>
      </Drawer>
      <Drawer opened={isAcceptOpened} onClose={closeAccept} title="Accept bid">
        <Container>
          <MyIndexSellItemAcceptBid {...token} order={order} name={collectionName} onFinish={closeAccept} />
        </Container>
      </Drawer>
    </Stack>
  )
}

export default MyIndexSellOnsaleCollapsed
