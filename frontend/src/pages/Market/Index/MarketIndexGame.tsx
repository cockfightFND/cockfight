import { useState } from "react"
import { AspectRatio, BackgroundImage, Box, Group, Stack, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import qs from "qs"
import type { TokenDetailResponse, Paginated } from "@initia/marketplace-api-types"
import type { CollectionResponse } from "@initia/marketplace-api-types"
import { formatAmount } from "@initia/utils"
import { useAPI } from "../../../data/api"
import MarketIndexGameItemList from "./MarketIndexGameItemList"

const MarketIndexGame = ({ collectionAddress, name, bannerUrl, oneDayVolume, isPfp }: CollectionResponse) => {
  const [filter] = useState({ status: "ALL" })
  const { data } = useAPI<Paginated<TokenDetailResponse>>(`/tokens/${collectionAddress}?${qs.stringify(filter)}`)

  if (!data) return null

  const itemList = data.data.slice(0, 3)
  const firstItemPrice = itemList?.[0]?.orders?.[0].fixedPrice

  return (
    <Box bg="black" c="white" sx={{ borderRadius: 20, overflow: "hidden" }}>
      <AspectRatio ratio={1}>
        <BackgroundImage src={bannerUrl + "/public"} c="white">
          <Stack
            spacing={16}
            w="100%"
            h="100%"
            bg="linear-gradient(to bottom, black, transparent, black)"
            justify="flex-end"
            p={20}
          >
            <Text component={Link} to={"./game/" + collectionAddress} fz={24} fw={800}>
              {name}
            </Text>

            <Group c="mono.5" fz={12} fw={600}>
              <Stack spacing={4}>
                <Text>Floor Price</Text>
                <Text>
                  <Text c="mono.0" fz={18} fw={700} span>
                    {formatAmount(firstItemPrice?.amount)}{" "}
                  </Text>{" "}
                  INIT
                </Text>
              </Stack>

              <Stack spacing={4}>
                <Text>1d Volume</Text>
                <Text>
                  <Text c="mono.0" fz={18} fw={700} span>
                    {formatAmount(oneDayVolume)}{" "}
                  </Text>{" "}
                  INIT
                </Text>
              </Stack>
            </Group>
          </Stack>
        </BackgroundImage>
      </AspectRatio>

      <Box p={20} pt={0}>
        <Box pt={20} sx={({ fn }) => ({ borderTop: `1px solid ${fn.themeColor("mono.8")}` })}>
          <MarketIndexGameItemList itemList={itemList} isPfp={isPfp} />
        </Box>
      </Box>
    </Box>
  )
}

export default MarketIndexGame
