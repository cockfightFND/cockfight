import { Box, Stack, Text } from "@mantine/core"
import { truncate } from "@initia/utils"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import useTokenAddress from "../../../hooks/useTokenAddress"
import Icon from "../../../styles/icons/Icon"
import { GLOBAL_PADDING } from "../../../styles/variables"
import BackButtonBar from "../../../components/BackButtonBar"
import AspectImage from "../../../components/AspectImage"
import WithTokenDetails from "../../../components/WithTokenDetails"
import MarketItemDetailsTag from "./MarketItemDetailsTag"
import MarketItemDetailsPrices from "./MarketItemDetailsPrices"
import MarketItemDetailsTraits from "./MarketItemDetailsTraits"
import MarketItemDetailsHistory from "./MarketItemDetailsHistory"
import MarketItemDetailsOrderButtons from "./MarketItemDetailsOrderButtons"
import WithCollectionInfo from "../../../components/WithCollectionInfo"

const MarketItemDetails = () => {
  const { collectionAddress, tokenAddress } = useTokenAddress()

  const render = (token: TokenDetailResponse) => {
    const { name, imageUrl, orders, backgroundColor, traits = [] } = token
    const order = orders?.[0]
    const seller = order?.seller

    return (
      <WithCollectionInfo collectionAddress={collectionAddress}>
        {({ isPfp }) => (
          <>
            <Box bg={backgroundColor} m={-GLOBAL_PADDING} mb={0}>
              <BackButtonBar label={name} />
              <AspectImage src={imageUrl + "/public"} isPfp={isPfp} />
            </Box>

            <Box bg="white" mx={-GLOBAL_PADDING} px={GLOBAL_PADDING} pt={24} pb={48}>
              <Text fz={34}>{truncate(tokenAddress)}</Text>
              {seller && (
                <MarketItemDetailsTag
                  title="Owner"
                  content={truncate(seller)}
                  icon={<Icon.User width={12} height={12} />}
                />
              )}
              {order && <MarketItemDetailsPrices {...order} />}
            </Box>

            <Stack spacing={60} py={32}>
              <MarketItemDetailsTraits traits={traits} />
              <MarketItemDetailsHistory />
            </Stack>
            <MarketItemDetailsOrderButtons {...token} />
          </>
        )}
      </WithCollectionInfo>
    )
  }

  return (
    <WithTokenDetails collectionAddress={collectionAddress} tokenAddress={tokenAddress}>
      {render}
    </WithTokenDetails>
  )
}

export default MarketItemDetails
