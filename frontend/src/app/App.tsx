import { useRecoilValue } from "recoil"
import { Global, MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { Outlet, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { InitiaEssentialsProvider } from "@initia/use-essentials"
import { ErrorBoundary } from "@initia/react-api"
import { GamesProvider, getGames } from "../vendors/games"
import fonts from "../styles/fonts"
import theme from "../styles/theme"
import { useIsDrawMenu } from "../styles/colorScheme"
import { API_URL, NETWORK_KEY, REST_URL, RPC_URL } from "../data/constants"
import { useAddress } from "../data/account"
import { GLOBAL_PADDING } from "../styles/variables"
import ScrollToTop from "../components/ScrollToTop"
import Container from "../components/Container"
import { backgroundColorState, fixedBottomHeightState, navigationBarHeightState, showNavigationBarState } from "./hooks"
import Navigation from "./Navigation"

const App = () => {
  const address = useAddress()
  const { pathname } = useLocation()

  /* data */
  const { data: games } = useQuery({ queryKey: ["games"], queryFn: getGames })

  /* styles */
  const isDrawMenu = useIsDrawMenu()
  const backgroundColor = useRecoilValue(backgroundColorState)
  const showNavigationBar = useRecoilValue(showNavigationBarState)
  const navigationHeight = useRecoilValue(navigationBarHeightState)
  const fixedBottomHeight = useRecoilValue(fixedBottomHeightState)

  const paddingBottom = navigationHeight + GLOBAL_PADDING + (fixedBottomHeight ? fixedBottomHeight + GLOBAL_PADDING : 0)
  
  if (!games) return null

  return (
    <GamesProvider value={games}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <ModalsProvider>
          <Global styles={fonts} />

          <Global
            styles={({ fn }) => ({
              body: isDrawMenu
                ? { background: "black", color: "white" }
                : { background: backgroundColor || fn.themeColor("mono.0") },
            })}
          />

          <Notifications />
          <ScrollToTop />

          <InitiaEssentialsProvider
            chain={{
              rpc: RPC_URL,
              rest: REST_URL,
              key: NETWORK_KEY,
              api: API_URL,
              modules: {},
              list: {},
            }}
            address={address}
          >
            <Container p={GLOBAL_PADDING} pb={paddingBottom}>
              <ErrorBoundary key={pathname.includes("create/draw") ? "create/draw" : pathname}>
                <Outlet />
              </ErrorBoundary>
            </Container>

            {showNavigationBar && (
              <Container pos="fixed" bottom={0} left={0} right={0} sx={{ zIndex: 100 }}>
                <Navigation />
              </Container>
            )}
          </InitiaEssentialsProvider>
        </ModalsProvider>
      </MantineProvider>
    </GamesProvider>
  )
}

export default App
