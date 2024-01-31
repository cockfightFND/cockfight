import { redirect } from "react-router-dom"
import App from "./app/App"

/* main */
import MainIndex from "./pages/Main/MainIndex"

/* market */
import MarketIndex from "./pages/Market/MarketIndex"

/* dashboard */
import DashboardIndex from "./pages/Dashboard/DashboardIndex"

/* my */
import MyIndex from "./pages/My/MyIndex"
import MyWallet from "./pages/My/MyWallet"
import MyWalletSettings from "./pages/My/MyWalletSettings"

/* accounts */

/* dev */
import MyWalletFaucet from "./pages/My/MyWalletFaucet"
import ManageAccounts from "./pages/My/Account/ManageAccounts"
import CreateAccountMnemonicForm from "./pages/My/Account/CreateAccountMnemonicForm"
import SocialLogin from "./pages/My/Account/SocialLogin"
import FightEntry from "./pages/Main/CockFight/FightEntry"


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
          { path: "fight/:id", element: <FightEntry /> },
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
