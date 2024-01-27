import { useParams } from "react-router-dom"
import { Box } from "@mantine/core"
import type { DrawHistory, HistoryResponse, Paginated } from "@initia/marketplace-api-types"
import DrawHistoryDetail from "../../../components/DrawHistoryDetail"
import { useAPI } from "../../../data/api"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"

const DrawPoolDetailsHistory = ({ isPfp }: { isPfp: boolean }) => {
  const { id } = useParams()
  const { data } = useAPI<Paginated<HistoryResponse<DrawHistory>>>(`/draws/histories/${id}`)
  const { pool } = useDrawPoolEntry()
  const { prizeCount } = pool

  return (
    <Box>
      {data?.data.map((history, index) => {
        const { data, timestamp } = history
        const { tickets } = data
        return (
          <DrawHistoryDetail
            py={20}
            tickets={tickets}
            timestamp={timestamp}
            prizeCount={prizeCount}
            key={index}
            isPfp={isPfp}
            sx={({ fn }) => ({
              borderBottom: `1px solid ${fn.themeColor("mono.8")}`,

              "&:first-of-type": {
                paddingTop: 0,
              },

              "&:last-of-type": {
                borderBottom: 0,
                paddingBottom: 0,
              },
            })}
          />
        )
      })}
    </Box>
  )
}

export default DrawPoolDetailsHistory
