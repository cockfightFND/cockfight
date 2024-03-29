import { Stack, Title } from "@mantine/core"
import GlobalChart from "./GlobalChart"
import GameHistoryTable from "./GameHistoryTable"

const DashboardIndex = () => {

  return (
    <>
      <Stack spacing={24}>
        <Title c="brand" ff="Fontdiner Swanky" fw={400} fz={28} mt={24} mb={16}>
          Dashboard
        </Title>
        <GameHistoryTable></GameHistoryTable>        

      </Stack>
    </>
  )
}

export default DashboardIndex
