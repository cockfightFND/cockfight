import type { PropsWithChildren } from "react"
import { Text } from "@mantine/core"

interface Props extends PropsWithChildren {
  isEmpty: boolean
}

const NoHistory = ({ children, isEmpty }: Props) => {
  if (isEmpty)
    return (
      <Text mt={30} fz={14} c="mono.5" ta="center">
        No history found
      </Text>
    )

  return children
}

export default NoHistory
