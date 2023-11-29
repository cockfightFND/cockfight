import { useEffect } from "react"
import { useResetRecoilState } from "recoil"
import { Stack } from "@mantine/core"
import PageTitle from "../../../components/PageTitle"
import { marketFilterState } from "../Game/market-filter"
import MarketIndexCarousel from "./MarketIndexCarousel"

const MarketIndex = () => {
  const resetRecoilState = useResetRecoilState(marketFilterState)

  useEffect(() => {
    resetRecoilState()
  }, [resetRecoilState])

  return (
    <Stack spacing={8}>
      <PageTitle>Market</PageTitle>
      {/* <MarketIndexCarousel /> */}
    </Stack>
  )
}

export default MarketIndex
