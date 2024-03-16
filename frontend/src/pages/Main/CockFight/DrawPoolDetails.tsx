import { Group, Stack, Tabs, Text, Title } from "@mantine/core"
import { formatPercent, truncate } from "../../utils/format"
import BoxList from "../../../components/BoxList"
import CircleImage from "../../../components/CircleImage"
import Icon from "../../../styles/icons/Icon"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import DrawPoolDetailsInventory from "./DrawPoolDetailsInventory"
import DrawPoolDetailsHistory from "./DrawPoolDetailsHistory"

const DrawPoolDetails = () => {
  const { pool } = useDrawPoolEntry()
  const { winProbability, collection, poolId, owner, ticketSold } = pool

  return (
    <>
      <Group position="apart" align="flex-start">
        <Stack spacing={6}>
          <CircleImage src={collection.thumbnailUrl + "/public"} width={28} height={28} />
          <Text fz={14} fw={600} c="purple.1">
            {collection.name}
          </Text>
          <Title fz={30} fw={700}>
            {pool.name}
          </Title>
        </Stack>
        <Group spacing={3} c="mono.2">
          <Icon.Dice width={14} height={14} />
          <Text fz={12} fw={600}>
            {formatPercent(winProbability)}
          </Text>
        </Group>
      </Group>

      <BoxList
        list={[
          { title: "id", content: poolId },
          { title: "creator", content: truncate(owner) },
          { title: "played", content: ticketSold },
        ]}
        mb={58}
        mt={24}
      />

      <Tabs
        defaultValue="inventory"
        styles={({ fn }) => ({
          tab: {
            borderBottom: `3px solid ${fn.themeColor("mono.7")}`,
            color: fn.themeColor("mono.7"),
            fontSize: 16,
            fontWeight: 800,

            "&:active, &:hover": { background: "transparent", color: fn.themeColor("mono.1") },
            "&[data-active]": {
              borderBottom: `3px solid ${fn.themeColor("mono.1")}`,
              color: fn.themeColor("mono.1"),
              "&:active, &:hover": { borderBottom: `3px solid ${fn.themeColor("mono.1")}` },
            },
            "&[aria-selected=false]": {
              color: fn.themeColor("purple.1"),
              borderColor: fn.themeColor("purple.2"),
            },
          },
        })}
      >
        <Tabs.List grow mb={28} sx={{ border: 0, gap: 5 }}>
          <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="inventory">
          <DrawPoolDetailsInventory isPfp={pool.collection.isPfp} />
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <DrawPoolDetailsHistory isPfp={pool.collection.isPfp} />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default DrawPoolDetails
