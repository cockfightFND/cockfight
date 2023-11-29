import { Stack } from "@mantine/core"
import { useAddress } from "../../../data/account"
import PageTitle from "../../../components/PageTitle"
import CreateAccount from "../Account/CreateAccount"
import InventoryIndexGameList from "./InventoryIndexGameList"

const InventoryIndex = () => {
  const address = useAddress()

  if (!address) return <CreateAccount />

  return (
    <Stack spacing={24}>
      <PageTitle>Inventory</PageTitle>
      <InventoryIndexGameList />
    </Stack>
  )
}

export default InventoryIndex
