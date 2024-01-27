import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import { Flex, Text } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { NavLink } from "react-router-dom"
import { useIsDrawMenu } from "../styles/colorScheme"
import { ReactComponent as DrawIcon } from "./icons/Draw.svg"
import { ReactComponent as InventoryIcon } from "./icons/Inventory.svg"
import { ReactComponent as MarketIcon } from "./icons/Market.svg"
import { ReactComponent as MyIcon } from "./icons/My.svg"
import { navigationBarHeightState } from "./hooks"

const navs = [
  { to: "/main", label: "Main", /*icon: <InventoryIcon width={24} height={24} /> */},
  { to: "/market", label: "Market", /* icon: <MarketIcon width={24} height={24} /> */},
  { to: "/dashboard", label: "Dashboard", /*icon: <DrawIcon width={24} height={24} />*/ },
  { to: "/my", label: "My Page", /*icon: <MyIcon width={24} height={24} /> */},
]

const Navigation = () => {
  const { ref, height } = useElementSize()
  const setNavigationBarHeight = useSetRecoilState(navigationBarHeightState)

  useEffect(() => {
    setNavigationBarHeight(height)
    return () => setNavigationBarHeight(0)
  }, [height, setNavigationBarHeight])

  const isDrawMenu = useIsDrawMenu()

  const borderTopShade = !isDrawMenu ? 1 : 8
  const backgroundColor = !isDrawMenu ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"

  const activeColor = !isDrawMenu ? "black" : "white"
  const inactiveColor = !isDrawMenu ? "mono.4" : "mono.5"

  return (
    <Flex
      bg={backgroundColor}
      sx={({ fn }) => ({
        borderTop: `1px solid ${fn.themeColor("mono." + borderTopShade)}`,
        backdropFilter: "blur(50px)",
      })}
      ref={ref}
    >
      {navs.map(({ to, label, icon }) => (
        <NavLink to={to} key={to} style={{ flex: 1 }}>
          {({ isActive }) => (
            <Flex
              c={isActive ? activeColor : inactiveColor}
              direction="column"
              justify="center"
              align="center"
              pt={20}
              pb={26}
            >
              {icon}
              <Text fz={11} fw={700}>
                {label}
              </Text>
            </Flex>
          )}
        </NavLink>
      ))}
    </Flex>
  )
}

export default Navigation
