import { Group, Image, Stack, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import { formatAmount, truncate } from "@initia/utils"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import DefaultButton from "../../../components/DefaultButton"

interface Props {
  itemList: TokenDetailResponse[]
  isPfp: boolean
}

const MarketIndexGameItemList = ({ itemList, isPfp }: Props) => {
  if (!itemList) return null

  return (
    <Stack spacing={12}>
      {itemList.map(({ collectionAddress, tokenAddress, imageUrl, name, orders, backgroundColor }, index) => {
        const fixedPrice = orders?.[0].fixedPrice
        return (
          <Group position="apart" key={index} noWrap>
            <Group spacing={12} miw={0} noWrap>
              <Image
                bg={backgroundColor}
                src={imageUrl + "/public"}
                width={52}
                height={52}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                }}
              />

              <Stack spacing={4} miw={0}>
                <Text fz={14} fw={600} truncate>
                  {name ?? truncate(tokenAddress)} {isPfp}
                </Text>

                {fixedPrice && (
                  <Text c="mono.5" fw={500} fz={14} truncate>
                    {formatAmount(fixedPrice.amount)}{" "}
                    <Text fz={11} span>
                      INIT
                    </Text>
                  </Text>
                )}
              </Stack>
            </Group>

            <DefaultButton
              component={Link}
              to={`./game/${collectionAddress}/item/${encodeURIComponent(tokenAddress)}`}
              invert
            >
              Buy
            </DefaultButton>
          </Group>
        )
      })}
    </Stack>
  )
}

export default MarketIndexGameItemList
