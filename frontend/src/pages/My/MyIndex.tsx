import { Box, Title } from "@mantine/core"
import MyIndexBalance from "./MyIndexBalance"
import { useAddress } from "../../data/account"
import CreateAccount from "./Account/CreateAccount"

const MyIndex = () => {
  const address = useAddress()

  if (!address) return <CreateAccount />

  return (
    <>
      <Title c="brand" ff="Fontdiner Swanky" fw={400} fz={28} mt={24} mb={16}>
        My Page
      </Title>
      <MyIndexBalance />
    </>
  )
}

export default MyIndex
