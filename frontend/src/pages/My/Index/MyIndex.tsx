import { Box } from "@mantine/core"
import PageTitle from "../../../components/PageTitle"
import { useAddress } from "../../../data/account"
import { GLOBAL_PADDING } from "../../../styles/variables"
import MyIndexBalance from "./MyIndexBalance"
import CreateAccount from "../../Inventory/Account/CreateAccount"

const MyIndex = () => {
  const address = useAddress()

  if (!address) return <CreateAccount />

  return (
    <>
      <Box bg="white" m={-GLOBAL_PADDING} mb={0} p={GLOBAL_PADDING}>
        <PageTitle>My Page</PageTitle>
        <MyIndexBalance />
      </Box>
    </>
  )
}

export default MyIndex
