import { Fragment, useEffect } from "react"
import { useRecoilValue, useResetRecoilState } from "recoil"
import qs from "qs"
import { Box, Stack, Title } from "@mantine/core"
import type { Token } from "@initia/marketplace-api-types"
import { useHideNavigation } from "../../../app/hooks"
import { usePaginatedAPI } from "../../../data/api"
import { useAddress } from "../../../data/account"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import { GLOBAL_PADDING } from "../../../styles/variables"
import CircleImage from "../../../components/CircleImage"
import BackButtonBar from "../../../components/BackButtonBar"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import FetchNextPage from "../../../components/FetchNextPage"
import InventoryGameDetailsSearch from "./InventoryGameDetailsSearch"
import InventoryGameDetailsMenu from "./InventoryGameDetailsMenu"
import InventoryGameDetailsItemList from "./InventoryGameDetailsItemList"
import { inventoryFilterState } from "./inventory-filter"

const InventoryGameDetails = () => {
  useHideNavigation()

  const collectionAddress = useCollectionAddress()
  const filter = useRecoilValue(inventoryFilterState)
  const resetFilter = useResetRecoilState(inventoryFilterState)

  const address = useAddress()
  const query = usePaginatedAPI<Token>(`/inventories/${collectionAddress}/${address}`, filter)
  const tokens = query.data?.pages.map((page) => page.data).flat()

  const renderList = (isPfp: boolean) => {
    if (!tokens) return null
    return (
      <Fragment key={qs.stringify(filter)}>
        <InventoryGameDetailsItemList tokens={tokens} isPfp={isPfp} />
        <FetchNextPage {...query} />
      </Fragment>
    )
  }

  useEffect(() => {
    resetFilter()
  }, [resetFilter])

  return (
    <WithCollectionInfo collectionAddress={collectionAddress}>
      {({ name, thumbnailUrl, isPfp }) => (
        <>
          <Box bg="white" m={-GLOBAL_PADDING} mb={0}>
            <BackButtonBar to="/inventory" />

            <Stack spacing={20} p={GLOBAL_PADDING} py={24}>
              <Stack spacing={6}>
                <CircleImage src={thumbnailUrl + "/public"} width={36} height={36} border="2px solid black" />
                <Title fz={34} fw={800}>
                  {name}
                </Title>
              </Stack>
              {!isPfp && <InventoryGameDetailsMenu hasTokens={!!(tokens && tokens?.length > 0) || !!filter.query} />}
            </Stack>
          </Box>

          <InventoryGameDetailsSearch />
          {renderList(isPfp)}
        </>
      )}
    </WithCollectionInfo>
  )
}

export default InventoryGameDetails
