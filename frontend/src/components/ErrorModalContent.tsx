import { Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import { SUBMIT_MARGIN } from "../styles/variables"
import SubmitButton from "./SubmitButton"

const ErrorModalContent = ({ error }: { error: unknown }) => {
  const getErrorMessage = () => {
    if (error instanceof Error) return error.message
    return String(error)
  }

  return (
    <>
      <Text sx={{ wordBreak: "break-all" }}>{getErrorMessage()}</Text>
      <SubmitButton onClick={() => modals.closeAll()} mt={SUBMIT_MARGIN}>
        Close
      </SubmitButton>
    </>
  )
}

export default ErrorModalContent
