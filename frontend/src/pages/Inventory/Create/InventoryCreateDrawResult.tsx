import { Box, Title } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { useFormContext } from "react-hook-form"
import WithTokenDetails from "../../../components/WithTokenDetails"
import AspectImage from "../../../components/AspectImage"
import FixedBottom from "../../../components/FixedBottom"
import SubmitButton from "../../../components/SubmitButton"
import { useBackgroundColor } from "../../../app/hooks"
import type { FormValues } from "./InventoryCreateDraw"

const InventoryCreateDrawResult = () => {
  useBackgroundColor("black")

  const { state } = useLocation()
  const navigate = useNavigate()
  const { getValues } = useFormContext<FormValues>()
  const { title } = getValues()

  return (
    <Box c="white" ta="center">
      <Title fz={28} mb={28} mt="12vh">
        {title} is successfully created!
      </Title>

      <WithTokenDetails {...state}>
        {({ imageUrl, backgroundColor }) => (
          <AspectImage bg={backgroundColor} src={imageUrl + "/public"} sx={{ borderRadius: 20 }} isPfp={state.isPfp} />
        )}
      </WithTokenDetails>

      <FixedBottom>
        <SubmitButton onClick={() => navigate(`/inventory/game/${state.collectionAddress}`, { replace: true })} invert>
          Done
        </SubmitButton>
      </FixedBottom>
    </Box>
  )
}

export default InventoryCreateDrawResult
