import { Stack, Title } from "@mantine/core"
import DuelBox from "./DuelBox"
import c_classic from "../../../img/c_classic.png"
import c_nerd from "../../../img/c_nerd.png"

const MarketIndex = () => {
  return (
    <>
      <Stack spacing={24}>
        <Title c="brand" ff="Fontdiner Swanky" fw={400} fz={28} mt={24} mb={16}>
            Marketplace
        </Title>
        <DuelBox stableChicken={c_classic} volatileChicken={c_nerd}></DuelBox>
      </Stack>
      
    </>
  )
}

export default MarketIndex
