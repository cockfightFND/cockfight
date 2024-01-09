import { Stack } from "@mantine/core"
import { useAddress } from "../../../data/account"
import PageTitle from "../../../components/PageTitle"
import InventoryIndexGameList from "./InventoryIndexGameList"
import HeadBar from "../Custom/HeadBar"
import RewardBox from "../Custom/RewardBox"

const InventoryIndex = () => {
  return (
    <>
      <HeadBar></HeadBar>
      <Stack spacing={24}>
        <RewardBox></RewardBox>
      </Stack>
    </>
  )
}

export default InventoryIndex
