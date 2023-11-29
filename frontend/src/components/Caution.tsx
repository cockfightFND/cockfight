import type { PropsWithChildren } from "react"
import { Alert } from "@mantine/core"

const Caution = ({ children = "Not implemented yet" }: PropsWithChildren) => {
  return (
    <Alert color="red" variant="filled">
      {children}
    </Alert>
  )
}

export default Caution
