import { Fragment } from "react"
import { useRecoilValue } from "recoil"
import qs from "qs"
import { BackgroundImage, SimpleGrid, Stack, Title } from "@mantine/core"
import type { PoolResponse } from "@initia/marketplace-api-types"
import { usePaginatedAPI } from "../../../data/api"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import { GLOBAL_PADDING } from "../../../styles/variables"
import DrawSummary from "../../../components/DrawSummary"
import CircleImage from "../../../components/CircleImage"
import BackButtonBar from "../../../components/BackButtonBar"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import FetchNextPage from "../../../components/FetchNextPage"
import { drawFilterState } from "./draw-filter"
import DrawGameDetailsSearch from "./DrawGameDetailsSearch"

const DrawGameDetails = () => {
  const collectionAddress = useCollectionAddress()
  const filter = useRecoilValue(drawFilterState)
  const query = usePaginatedAPI<PoolResponse>("/draws/pools/" + collectionAddress, filter)
  const pools = query.data?.pages.map((page) => page.data).flat()

  const renderList = (isPfp: boolean) => {
    if (!pools) return null
    return (
      <Fragment key={qs.stringify(filter)}>
        <SimpleGrid cols={2} spacing={16} py={36}>
          {pools.map((item, index) => (
            <DrawSummary {...item} isPfp={isPfp} key={index} />
          ))}
        </SimpleGrid>

        <FetchNextPage {...query} />
      </Fragment>
    )
  }

  return (
    <WithCollectionInfo collectionAddress={collectionAddress}>
      {({ name, thumbnailUrl, isPfp }) => (
        <>
          <Stack m={-GLOBAL_PADDING} mb={0}>
            <BackgroundImage src={thumbnailUrl + "/public"}>
              <Stack
                spacing={4}
                bg="linear-gradient(to top, black, transparent)"
                sx={{ backdropFilter: "blur(10px)" }}
                p={GLOBAL_PADDING}
                pb={30}
              >
                <BackButtonBar buttonColor="mono.5" m={-GLOBAL_PADDING} mb={0} />

                <Stack spacing={10} align="center">
                  <CircleImage
                    src={thumbnailUrl + "/public"}
                    width={84}
                    height={84}
                    border={({ fn }) => `1px solid ${fn.themeColor("mono.2")}`}
                  />

                  <Title c="mono.2" fz={24} fw={800}>
                    {name}
                  </Title>
                </Stack>
              </Stack>
            </BackgroundImage>
          </Stack>
          <DrawGameDetailsSearch />
          {renderList(isPfp)}
        </>
      )}
    </WithCollectionInfo>
  )
}

export default DrawGameDetails
