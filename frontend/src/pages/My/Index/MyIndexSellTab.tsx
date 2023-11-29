import { useRecoilState } from "recoil"
import { Tabs, Stack, Group, Text, Box } from "@mantine/core"
import type { UserOrdersResponse } from "@initia/marketplace-api-types"
import { SellStatus } from "@initia/marketplace-api-types"
import { usePaginatedAPI } from "../../../data/api"
import { useAddress } from "../../../data/account"
import toSentenceCase from "../../../utils/toSentenceCase"
import Icon from "../../../styles/icons/Icon"
import CountTab from "../../../components/CountTab"
import NoHistory from "../../../components/NoHistory"
import MyIndexTabComponent from "./MyIndexTabComponent"
import MyIndexSellOnsale from "./MyIndexSellOnsale"
import MyIndexSellSold from "./MyIndexSellSold"
import MyIndexSellCanceled from "./MyIndexSellCanceled"
import { myFilterState } from "./my-filter"

const MyIndexSellTab = () => {
  const address = useAddress()

  const [filter] = useRecoilState(myFilterState)
  const { query, isOpen } = filter

  const onsaleQuery = usePaginatedAPI<UserOrdersResponse>(`/users/sells/${address}`, {
    status: SellStatus.Onsale,
    query,
  })
  const soldQuery = usePaginatedAPI<UserOrdersResponse>(`/users/sells/${address}`, {
    status: SellStatus.Sold,
    query,
  })
  const canceledQuery = usePaginatedAPI<UserOrdersResponse>(`/users/sells/${address}`, {
    status: SellStatus.Canceled,
    query,
  })

  if (!(onsaleQuery.data && soldQuery.data && canceledQuery.data)) return null

  const onsaleTotal = onsaleQuery.data?.pages[0].metaData.totalCount
  const soldTotal = soldQuery.data?.pages[0].metaData.totalCount
  const canceledTotal = canceledQuery.data?.pages[0].metaData.totalCount

  const defaultTab = () => {
    if (onsaleTotal > 0) return SellStatus.Onsale
    if (soldTotal > 0) return SellStatus.Sold
    if (canceledTotal > 0) return SellStatus.Canceled
    return SellStatus.Onsale
  }

  return (
    <MyIndexTabComponent defaultValue={defaultTab()}>
      <Group position="apart" noWrap>
        {!isOpen && (
          <Tabs.List sx={{ flexWrap: "nowrap", overflow: "auto" }}>
            <Tabs.Tab value={SellStatus.Onsale}>
              <CountTab
                title={toSentenceCase(SellStatus.Onsale)}
                count={onsaleTotal}
                icon={<Icon.Tag width={12} height={12} />}
              />
            </Tabs.Tab>
            <Tabs.Tab value={SellStatus.Sold}>
              <CountTab
                title={toSentenceCase(SellStatus.Sold)}
                count={soldTotal}
                icon={<Icon.CheckCircle width={12} height={12} />}
              />
            </Tabs.Tab>
            <Tabs.Tab value={SellStatus.Canceled}>
              <CountTab
                title={toSentenceCase(SellStatus.Canceled)}
                count={canceledTotal}
                icon={<Icon.Cancel width={12} height={12} />}
              />
            </Tabs.Tab>
          </Tabs.List>
        )}
        <Box w={16} h={16} />
      </Group>

      {!isOpen ? (
        <>
          <Tabs.Panel value={SellStatus.Onsale} pt={20}>
            <NoHistory isEmpty={!onsaleTotal}>
              <MyIndexSellOnsale query={onsaleQuery} />
            </NoHistory>
          </Tabs.Panel>

          <Tabs.Panel value={SellStatus.Sold} pt={20}>
            <NoHistory isEmpty={!soldTotal}>
              <MyIndexSellSold query={soldQuery} />
            </NoHistory>
          </Tabs.Panel>

          <Tabs.Panel value={SellStatus.Canceled} pt={20}>
            <NoHistory isEmpty={!canceledTotal}>
              <MyIndexSellCanceled query={canceledQuery} />
            </NoHistory>
          </Tabs.Panel>
        </>
      ) : (
        <NoHistory isEmpty={!(onsaleTotal || soldTotal || canceledTotal)}>
          <Stack>
            {!!onsaleTotal && (
              <Stack spacing={10} pb={12}>
                <Group spacing={2}>
                  <Icon.Tag width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    On Sale
                  </Text>
                </Group>
                <MyIndexSellOnsale query={onsaleQuery} />
              </Stack>
            )}
            {!!soldTotal && (
              <Stack spacing={10} pb={12}>
                <Group spacing={2}>
                  <Icon.CheckCircle width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    Sold
                  </Text>
                </Group>
                <MyIndexSellSold query={soldQuery} />
              </Stack>
            )}
            {!!canceledTotal && (
              <Stack spacing={10}>
                <Group spacing={2}>
                  <Icon.Cancel width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    Canceled
                  </Text>
                </Group>
                <MyIndexSellCanceled query={canceledQuery} />
              </Stack>
            )}
          </Stack>
        </NoHistory>
      )}
    </MyIndexTabComponent>
  )
}

export default MyIndexSellTab
