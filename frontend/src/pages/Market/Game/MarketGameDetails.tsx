import { Fragment } from "react"
import { useRecoilValue } from "recoil"
import qs from "qs"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import { usePaginatedAPI } from "../../../data/api"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import FetchNextPage from "../../../components/FetchNextPage"
import { marketFilterState } from "./market-filter"
import MarketGameDetailsHeader from "./MarketGameDetailsHeader"
import MarketGameDetailsSearch from "./MarketGameDetailsSearch"
import MarketGameDetailsItemList from "./MarketGameDetailsItemList"

const MarketGameDetails = () => {
  const collectionAddress = useCollectionAddress()
  const filter = useRecoilValue(marketFilterState)
  const query = usePaginatedAPI<TokenDetailResponse>(`/tokens/${collectionAddress}`, filter)
  const tokens = query.data?.pages.map(({ data }) => data).flat()

  const renderList = () => {
    if (!tokens) return null
    return (
      <Fragment key={qs.stringify(filter)}>
        <MarketGameDetailsItemList list={tokens} />
        <FetchNextPage {...query} />
      </Fragment>
    )
  }

  return (
    <>
      <MarketGameDetailsHeader collectionAddress={collectionAddress} />
      <MarketGameDetailsSearch />
      {renderList()}
    </>
  )
}

export default MarketGameDetails
