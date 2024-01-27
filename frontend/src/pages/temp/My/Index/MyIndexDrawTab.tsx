import { useRecoilState } from "recoil"
import { Tabs, Stack, Group, Text, Box } from "@mantine/core"
import type { PoolResponse, UserDrawResponse } from "@initia/marketplace-api-types"
import { DrawStatus } from "@initia/marketplace-api-types"
import { usePaginatedAPI } from "../../../data/api"
import { useAddress } from "../../../data/account"
import toSentenceCase from "../../../utils/toSentenceCase"
import Icon from "../../../styles/icons/Icon"
import CountTab from "../../../components/CountTab"
import NoHistory from "../../../components/NoHistory"
import MyIndexTabComponent from "./MyIndexTabComponent"
import MyIndexDrawTabContent from "./MyIndexDrawTabContent"
import MyIndexDrawPlayed from "./MyIndexDrawPlayed"
import { myFilterState } from "./my-filter"

const MyIndexDrawTab = () => {
  const address = useAddress()

  const [filter] = useRecoilState(myFilterState)
  const { query, isOpen } = filter

  const playedQuery = usePaginatedAPI<UserDrawResponse>(`/users/draws/${address}/played`, { query })
  const openQuery = usePaginatedAPI<PoolResponse>(`/users/draws/${address}`, {
    status: DrawStatus.Open,
    query,
  })
  const closedQuery = usePaginatedAPI<PoolResponse>(`/users/draws/${address}`, {
    status: DrawStatus.Closed,
    query,
  })

  if (!(playedQuery.data && openQuery.data && closedQuery.data)) return null

  const openTotal = openQuery.data?.pages[0].metaData.totalCount
  const closedTotal = closedQuery.data?.pages[0].metaData.totalCount
  const playedTotal = playedQuery.data?.pages[0].metaData.totalCount

  const getDefaultTab = () => {
    if (playedTotal > 0) return "played"
    if (openTotal > 0) return DrawStatus.Open
    if (closedTotal > 0) return DrawStatus.Closed
    return "played"
  }

  return (
    <MyIndexTabComponent defaultValue={getDefaultTab()}>
      <Group position="apart" noWrap>
        {!isOpen && (
          <Tabs.List sx={{ flexWrap: "nowrap", overflow: "auto" }}>
            <Tabs.Tab value="played">
              <CountTab title="Played" count={playedTotal} icon={<Icon.Dice width={12} height={12} />} />
            </Tabs.Tab>
            <Tabs.Tab value={DrawStatus.Open}>
              <CountTab
                title={toSentenceCase(DrawStatus.Open)}
                count={openTotal}
                icon={<Icon.Lightning width={12} height={12} />}
              />
            </Tabs.Tab>
            <Tabs.Tab value={DrawStatus.Closed}>
              <CountTab
                title={toSentenceCase(DrawStatus.Closed)}
                count={closedTotal}
                icon={<Icon.Lock width={12} height={12} />}
              />
            </Tabs.Tab>
          </Tabs.List>
        )}
        <Box w={16} h={16} />
      </Group>

      {!isOpen ? (
        <>
          <Tabs.Panel value="played" pt={20}>
            <NoHistory isEmpty={!playedTotal}>
              <MyIndexDrawPlayed query={playedQuery} />
            </NoHistory>
          </Tabs.Panel>

          <Tabs.Panel value={DrawStatus.Open} pt={20}>
            <NoHistory isEmpty={!openTotal}>
              <MyIndexDrawTabContent type={DrawStatus.Open} query={openQuery} />
            </NoHistory>
          </Tabs.Panel>

          <Tabs.Panel value={DrawStatus.Closed} pt={20}>
            <NoHistory isEmpty={!closedTotal}>
              <MyIndexDrawTabContent type={DrawStatus.Closed} query={closedQuery} />
            </NoHistory>
          </Tabs.Panel>
        </>
      ) : (
        <NoHistory isEmpty={!(playedTotal || openTotal || closedTotal)}>
          <Stack>
            {!!playedTotal && (
              <Stack spacing={10} pb={12}>
                <Group spacing={2}>
                  <Icon.Dice width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    Played
                  </Text>
                </Group>
                <MyIndexDrawPlayed query={playedQuery} />
              </Stack>
            )}
            {!!openTotal && (
              <Stack spacing={10} pb={12}>
                <Group spacing={2}>
                  <Icon.Lightning width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    Open
                  </Text>
                </Group>
                <MyIndexDrawTabContent type={DrawStatus.Open} query={openQuery} />
              </Stack>
            )}
            {!!closedTotal && (
              <Stack spacing={10}>
                <Group spacing={2}>
                  <Icon.Lock width={12} height={12} />
                  <Text c="mono.7" fz={12} tt="uppercase">
                    Closed
                  </Text>
                </Group>
                <MyIndexDrawTabContent type={DrawStatus.Closed} query={closedQuery} />
              </Stack>
            )}
          </Stack>
        </NoHistory>
      )}
    </MyIndexTabComponent>
  )
}

export default MyIndexDrawTab
