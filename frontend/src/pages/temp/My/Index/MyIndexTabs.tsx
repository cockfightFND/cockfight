import { useEffect } from "react"
import { useResetRecoilState } from "recoil"
import { Tabs } from "@mantine/core"
import { GLOBAL_PADDING } from "../../../styles/variables"
import MyIndexSellTab from "./MyIndexSellTab"
import MyIndexDrawTab from "./MyIndexDrawTab"
import MyIndexBuyTab from "./MyIndexBuyTab"
import MyIndexSearch from "./MyIndexSearch"
import { myFilterState } from "./my-filter"

const MyIndexTabs = () => {
  const resetSearch = useResetRecoilState(myFilterState)

  useEffect(() => {
    return () => {
      resetSearch()
    }
  }, [resetSearch])

  return (
    <Tabs
      defaultValue="draw"
      mx={-GLOBAL_PADDING}
      keepMounted={false}
      onTabChange={resetSearch}
      styles={({ fn }) => ({
        root: { position: "relative" },
        tabsList: { background: "white", border: 0, gap: 32 },
        tab: {
          borderWidth: 4,
          color: fn.themeColor("mono.5"),
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 0,
          padding: 10,

          ...fn.hover({ background: "white", borderColor: "white" }),

          "&[data-active]": {
            borderColor: fn.themeColor("mono.8"),
            color: fn.themeColor("mono.8"),
            fontWeight: 900,

            ...fn.hover({ borderColor: fn.themeColor("mono.8") }),
          },
        },
        panel: {
          position: "relative",
          background: fn.themeColor("mono.0"),
          padding: 20,
          paddingTop: 24,
          marginBottom: -GLOBAL_PADDING,
        },
      })}
    >
      <Tabs.List position="center">
        <Tabs.Tab value="draw">Draw</Tabs.Tab>
        <Tabs.Tab value="buy">Buy</Tabs.Tab>
        <Tabs.Tab value="sell">Sell</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="draw">
        <MyIndexSearch />
        <MyIndexDrawTab />
      </Tabs.Panel>

      <Tabs.Panel value="buy">
        <MyIndexSearch />
        <MyIndexBuyTab />
      </Tabs.Panel>

      <Tabs.Panel value="sell">
        <MyIndexSearch />
        <MyIndexSellTab />
      </Tabs.Panel>
    </Tabs>
  )
}

export default MyIndexTabs
