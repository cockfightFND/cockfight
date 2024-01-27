import { Drawer, Group, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import { SUBMIT_MARGIN } from "../../../styles/variables"
import Container from "../../../components/Container"
import SubmitButton from "../../../components/SubmitButton"
import MarketItemBuy from "./MarketItemBuy"
import MarketItemBid from "./MarketItemBid"

const MarketItemDetailsOrderButtons = (token: TokenDetailResponse) => {
  const auctionInfo = token.orders?.[0].auctionInfo

  const [isBuyOpened, { open: openBuy, close: closeBuy }] = useDisclosure(false)
  const [isBidOpened, { open: openBid, close: closeBid }] = useDisclosure(false)

  if (!token?.orders) return null

  return (
    <>
      <Group spacing={8} mt={SUBMIT_MARGIN} grow>
        {auctionInfo && (
          <SubmitButton onClick={openBid} invert>
            Place a Bid
          </SubmitButton>
        )}

        <SubmitButton onClick={openBuy}>Buy Now</SubmitButton>
      </Group>

      <Modal opened={isBidOpened} onClose={closeBid} title="Place a bid" fullScreen>
        <Container>
          <MarketItemBid {...token} onFinish={closeBid} />
        </Container>
      </Modal>

      <Drawer opened={isBuyOpened} onClose={closeBuy} title="Buy">
        <Container>
          <MarketItemBuy {...token} onFinish={closeBuy} />
        </Container>
      </Drawer>
    </>
  )
}

export default MarketItemDetailsOrderButtons
