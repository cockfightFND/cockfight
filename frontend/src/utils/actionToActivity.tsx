import type {
  BatchMakeFixedPriceOrderEvent,
  BatchMakeAuctionOrderEvent,
  HistoryData,
  SweepEvent,
} from "@initia/marketplace-api-types/dist/common/history-data"
import type {
  BidEvent,
  RefundEvent,
  ExecuteAuctionEvent,
  CancelOrderEvent,
  ExecuteOrderEvent,
  MakeAuctionOrderEvent,
  MakeFixedPriceOrderEvent,
} from "@initia/marketplace-api-types/dist/events/market-core"
import type { TransferEvent } from "@initia/marketplace-api-types/dist/events/nft"
import type {
  ExecuteTicketEvent,
  MakePoolEvent,
  EndPoolEvent,
} from "@initia/marketplace-api-types/dist/events/token-draw"
import Icon from "../styles/icons/Icon"

function actionToActivity(action: string, data: HistoryData) {
  switch (action) {
    case "nft_mint": {
      return { title: "Mint", icon: <Icon.Plus /> }
    }

    case "nft_transfer": {
      const { from, to } = data as TransferEvent
      return { title: "Transfer", icon: <Icon.ArrowRight />, addressList: [from, to] }
    }

    case "make_fixed_price_order": {
      const { seller, unit_price } = data as MakeFixedPriceOrderEvent
      return { title: "List", icon: <Icon.Tag />, addressList: [seller], amount: unit_price.amount }
    }

    case "batch_make_fixed_price_order": {
      const { seller, price } = data as BatchMakeFixedPriceOrderEvent
      return { title: "List", icon: <Icon.Tag />, addressList: [seller], amount: price.amount }
    }

    case "bid": {
      const { bidder, bid_price } = data as BidEvent
      return { title: "Bid", icon: <Icon.Hammer />, addressList: [bidder], amount: bid_price.amount }
    }

    case "refund": {
      const { bidder, refund_asset } = data as RefundEvent
      return { title: "Refund", icon: <Icon.CancelFilled />, addressList: [bidder], amount: refund_asset.amount }
    }

    case "make_auction_order": {
      const { seller, start_price } = data as MakeAuctionOrderEvent
      return { title: "List", icon: <Icon.Tag />, addressList: [seller], amount: start_price.amount }
    }

    case "batch_make_auction_order": {
      const { seller, start_price } = data as BatchMakeAuctionOrderEvent
      return { title: "List", icon: <Icon.Tag />, addressList: [seller], amount: start_price.amount }
    }

    case "cancel_order": {
      const { seller } = data as CancelOrderEvent
      return { title: "Cancel List", icon: <Icon.CancelFilled />, addressList: [seller] }
    }

    case "execute_order": {
      const { seller, buyer, total_price } = data as ExecuteOrderEvent
      return { title: "Sale", icon: <Icon.Bag />, addressList: [seller, buyer], amount: total_price.amount }
    }

    case "execute_auction": {
      const { seller, buyer, price } = data as ExecuteAuctionEvent
      return { title: "Sale", icon: <Icon.Bag />, addressList: [seller, buyer], amount: price.amount }
    }

    case "sweep": {
      const { buyer } = data as SweepEvent
      return { title: "Sale", icon: <Icon.Bag />, addressList: [buyer] }
    }

    case "make_pool": {
      const { ticket_price } = data as MakePoolEvent
      return { title: "Create Draw", icon: <Icon.Dice />, amount: ticket_price.amount }
    }

    case "execute_ticket": {
      const { ticket_buyer } = data as ExecuteTicketEvent
      return { title: "Draw", icon: <Icon.Dice />, addressList: [ticket_buyer] }
    }

    case "end_pool": {
      const { owner } = data as EndPoolEvent
      return { title: "End Draw", icon: <Icon.CancelFilled />, addressList: [owner] }
    }

    case "withdraw_pool": {
      return { title: "End Draw", icon: <Icon.Dice /> }
    }

    default: {
      return { title: "", icon: <></> }
    }
  }
}

export default actionToActivity
