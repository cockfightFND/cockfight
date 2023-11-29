import { Stack, Text, Flex } from "@mantine/core"
import type { Paginated, HistoryResponse } from "@initia/marketplace-api-types"
import { useAPI } from "../../../data/api"
import useTokenAddress from "../../../hooks/useTokenAddress"
import ActivityItem from "../../../components/ActivityItem"
import Icon from "../../../styles/icons/Icon"

const MarketItemDetailsHistory = () => {
  const { collectionAddress, tokenAddress } = useTokenAddress()
  const { data } = useAPI<Paginated<HistoryResponse>>(`/tokens/histories/${collectionAddress}/${tokenAddress}`)

  if (!data) return null

  return (
    <Stack spacing={20}>
      <Flex align="center" gap={6}>
        <Icon.Doc width={18} height={18} />
        <Text fw={800} tt="uppercase">
          Activity
        </Text>
      </Flex>

      <Stack spacing={20}>
        {data.data.map((data, index) => (
          <ActivityItem {...data} key={index} />
        ))}
      </Stack>
    </Stack>
  )
}

export default MarketItemDetailsHistory
