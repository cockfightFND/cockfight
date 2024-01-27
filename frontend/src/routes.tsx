import { redirect } from "react-router-dom"
import App from "./app/App"

/* draw */
/* market */
// import MarketIndex from "./pages/Market/Index/MarketIndex"
// import MarketGameDetails from "./pages/Market/Game/MarketGameDetails"
// import MarketItemDetails from "./pages/Market/Item/MarketItemDetails"

/* inventory */
/* my */
// import MyIndex from "./pages/My/Index/MyIndex"
import MyWallet from "./pages/My/MyWallet"
import MyWalletSettings from "./pages/My/MyWalletSettings"

/* accounts */

/* dev */
import MyWalletFaucet from "./pages/My/MyWalletFaucet"
import ManageAccounts from "./pages/My/Account/ManageAccounts"
import CreateAccountMnemonicForm from "./pages/My/Account/CreateAccountMnemonicForm"
import SocialLogin from "./pages/My/Account/SocialLogin"
// import InventoryIndex from "./pages/Main/Index/InventoryIndex"
import DrawIndex from "./pages/Fight/DrawIndex"
import MainIndex from "./pages/Main/MainIndex"
import DashboardIndex from "./pages/Dashboard/DashboardIndex"
import MarketIndex from "./pages/Market/MarketIndex"
// import DrawGameDetails from "./pages/Fight/Game/DrawGameDetails"
// import DrawPoolEntry from "./pages/Fight/Pool/DrawPoolEntry"

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", loader: () => redirect("/main") },
      {
        path: "main",
        children: [
          { index: true, element: <MainIndex /> },
        ],
      },
      {
        path: "market",
        children: [
          { index: true, element: <MarketIndex /> },
        ],
      },
      {
        path: "dashboard",
        children: [
          { index: true, element: <DashboardIndex /> },
        ],
      },
      {
        path: "my",
        children: [
          // { index: true, element: <MyIndex /> },
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
