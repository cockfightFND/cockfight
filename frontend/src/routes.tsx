import { redirect } from "react-router-dom"
import App from "./app/App"

/* draw */
import DrawIndex from "./pages/Draw/Index/DrawIndex"
import DrawGameDetails from "./pages/Draw/Game/DrawGameDetails"
import DrawPoolEntry from "./pages/Draw/Pool/DrawPoolEntry"

/* market */
import MarketIndex from "./pages/Market/Index/MarketIndex"
import MarketGameDetails from "./pages/Market/Game/MarketGameDetails"
import MarketItemDetails from "./pages/Market/Item/MarketItemDetails"

/* inventory */
import InventoryIndex from "./pages/Inventory/Index/InventoryIndex"
import InventoryGameDetails from "./pages/Inventory/Game/InventoryGameDetails"
import InventoryGameDetailsImport from "./pages/Inventory/Game/InventoryGameDetailsImport"
import InventoryGameDetailsExport from "./pages/Inventory/Game/InventoryGameDetailsExport"
import InventoryCreateDraw from "./pages/Inventory/Create/InventoryCreateDraw"
import InventoryCreateDrawStep1 from "./pages/Inventory/Create/InventoryCreateDrawStep1"
import InventoryCreateDrawStep2 from "./pages/Inventory/Create/InventoryCreateDrawStep2"
import InventoryCreateDrawStep3 from "./pages/Inventory/Create/InventoryCreateDrawStep3"
import InventoryCreateDrawResult from "./pages/Inventory/Create/InventoryCreateDrawResult"
import InventoryCreateSell from "./pages/Inventory/Create/InventoryCreateSell"

/* my */
import MyIndex from "./pages/My/Index/MyIndex"
import MyWallet from "./pages/My/Wallet/MyWallet"
import MyWalletSettings from "./pages/My/Wallet/MyWalletSettings"

/* accounts */
import ManageAccounts from "./pages/Inventory/Account/ManageAccounts"
import CreateAccountMnemonicForm from "./pages/Inventory/Account/CreateAccountMnemonicForm"
import SocialLogin from "./pages/Inventory/Account/SocialLogin"

/* dev */
import MyWalletFaucet from "./pages/My/Wallet/MyWalletFaucet"

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", loader: () => redirect("/draw") },
      {
        path: "draw",
        children: [
          { index: true, element: <DrawIndex /> },
          { path: "game/:collectionAddress", element: <DrawGameDetails /> },
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
        path: "inventory",
        children: [
          { index: true, element: <InventoryIndex /> },
          {
            path: "game/:collectionAddress",
            children: [
              { index: true, element: <InventoryGameDetails /> },
              { path: "import", element: <InventoryGameDetailsImport /> },
              { path: "export", element: <InventoryGameDetailsExport /> },
            ],
          },
          {
            path: "create/sell",
            element: <InventoryCreateSell />,
          },
          {
            path: "create/draw",
            element: <InventoryCreateDraw />,
            children: [
              { index: true, element: <InventoryCreateDrawStep1 /> },
              { path: "2", element: <InventoryCreateDrawStep2 /> },
              { path: "3", element: <InventoryCreateDrawStep3 /> },
              { path: "result", element: <InventoryCreateDrawResult /> },
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
