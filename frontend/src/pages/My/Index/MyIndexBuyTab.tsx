import { useRecoilState } from "recoil"
import { Tabs, Stack, Group, Text, Box } from "@mantine/core"
import type { Order, UserOrdersResponse } from "@initia/marketplace-api-types"
import { usePaginatedAPI } from "../../../data/api"
import { useAddress } from "../../../data/account"
import Icon from "../../../styles/icons/Icon"
import CountTab from "../../../components/CountTab"
import NoHistory from "../../../components/NoHistory"
import MyIndexTabComponent from "./MyIndexTabComponent"
import MyIndexBuyBid from "./MyIndexBuyBid"
import MyIndexBuyPurchase from "./MyIndexBuyPurchase"
import { myFilterState } from "./my-filter"

const MyIndexBuyTab = () => {
  const address = useAddress()

  const [filter] = useRecoilState(myFilterState)
  const { query, isOpen } = filter

  const bidQuery = usePaginatedAPI<Order>(`/users/buys/${address}/bid`, { query })
  const purchaseQuery = usePaginatedAPI<UserOrdersResponse>(`/users/buys/${address}/purchase`, { query })

  if (!(bidQuery.data && purchaseQuery.data)) return null

  const bidTotal = bidQuery.data?.pages[0].metaData.totalCount
  const purchaseTotal = purchaseQuery.data?.pages[0].metaData.totalCount

  const defaultTab = () => {
    if (bidTotal > 0) return "bid"
    if (purchaseTotal > 0) return "purchase"
    return "bid"
  }

  return (
    <MyIndexTabComponent defaultValue={defaultTab()}>
      <Group position="apart" noWrap>
        {!isOpen && (
          <Tabs.List sx={{ flexWrap: "nowrap", overflow: "auto" }}>
            <Tabs.Tab value="bid">
              <CountTab title="Bid" count={bidTotal} icon={<Icon.Hammer width={12} height={12} />} />
            </Tabs.Tab>
            <Tabs.Tab value="purchase">
              <CountTab title="Purchase" count={purchaseTotal} icon={<Icon.Bag width={12} height={12} />} />
            </Tabs.Tab>
          </Tabs.List>
        )}

        <Box w={16} h={16} />
      </Group>

      {!isOpen ? (
        <>
          <Tabs.Panel value="bid" pt={20}>
            <NoHistory isEmpty={!bidTotal}>
              <MyIndexBuyBid query={bidQuery} />
            </NoHistory>
          </Tabs.Panel>

          <Tabs.Panel value="purchase" pt={20}>
            <NoHistory isEmpty={!purchaseTotal}>
              <MyIndexBuyPurchase query={purchaseQuery} />
            </NoHistory>
          </Tabs.Panel>
        </>
      ) : (
        <NoHistory isEmpty={!(bidTotal || purchaseTotal)}>
          <Stack>
            {!!bidTotal && (
              <Stack spacing={10} pb={12}>
                <Group spacing={2}>
                  <Icon.Hammer width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    Bid
                  </Text>
                </Group>
                <MyIndexBuyBid query={bidQuery} />
              </Stack>
            )}
            {!!purchaseTotal && (
              <Stack spacing={10}>
                <Group spacing={2}>
                  <Icon.Bag width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    Purchase
                  </Text>
                </Group>
                <MyIndexBuyPurchase query={purchaseQuery} />
              </Stack>
            )}
          </Stack>
        </NoHistory>
      )}
    </MyIndexTabComponent>
  )
}

export default MyIndexBuyTab
