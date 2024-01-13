import { redirect } from "react-router-dom"
import App from "./app/App"

/* draw */
/* market */
import MarketIndex from "./pages/Market/Index/MarketIndex"
import MarketGameDetails from "./pages/Market/Game/MarketGameDetails"
import MarketItemDetails from "./pages/Market/Item/MarketItemDetails"

/* inventory */
/* my */
import MyIndex from "./pages/My/Index/MyIndex"
import MyWallet from "./pages/My/MyWallet"
import MyWalletSettings from "./pages/My/MyWalletSettings"

/* accounts */

/* dev */
import MyWalletFaucet from "./pages/My/MyWalletFaucet"
import ManageAccounts from "./pages/My/Account/ManageAccounts"
import CreateAccountMnemonicForm from "./pages/My/Account/CreateAccountMnemonicForm"
import SocialLogin from "./pages/My/Account/SocialLogin"
import InventoryIndex from "./pages/Main/Index/InventoryIndex"
import DrawIndex from "./pages/Fight/Index/DrawIndex"
import DrawGameDetails from "./pages/Fight/Game/DrawGameDetails"
import DrawPoolEntry from "./pages/Fight/Pool/DrawPoolEntry"
import { createContext } from "@initia/react-api"

export const [useMarket, MarketProvider] = createContext("buy")

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", loader: () => redirect("/inventory") },
      {
        path: "inventory",
        children: [
          { index: true, element: <InventoryIndex /> },
        ],
      },
      {
        path: "draw",
        children: [
          { index: true, element: <DrawIndex /> },
          { path: "pool/:id", element: <DrawPoolEntry /> },
        ],
      },
      {
        path: "market",
        children: [
          { index: true, element: <MarketIndex /> },
          {
            path: "game/:collectionAddress",
            children: [
              { index: true, element: <MarketGameDetails /> },
              { path: "item/:tokenAddress", element: <MarketItemDetails /> },
            ],
          },
        ],
      },
      {
        path: "my",
        children: [
          { index: true, element: <MyIndex /> },
          {
            path: "wallet",
            children: [
              { index: true, element: <MyWallet /> },
              { path: "settings", element: <MyWalletSettings /> },
            ],
          },
          {
            path: "account",
            children: [
              { path: "manage", element: <ManageAccounts /> },
              { path: "create", children: [{ path: "mnemonic", element: <CreateAccountMnemonicForm /> }] },
              { path: "social", element: <SocialLogin /> },
            ],
          },
        ],
      },
      { path: "faucet", element: <MyWalletFaucet /> },
    ],
  },
]

export default routes
