import { useEffect } from "react"
import { useResetRecoilState } from "recoil"
import { Stack } from "@mantine/core"
import PageTitle from "../../../components/PageTitle"
import { marketFilterState } from "../Game/market-filter"
import MarketGrid from "../Custom/MarketGrid"

const MarketIndex = () => {
  return (
    <>
      <Stack spacing={8}>
        <PageTitle>Market</PageTitle>
        <MarketGrid></MarketGrid>
      </Stack>
    </>
  )
}

export default MarketIndex
