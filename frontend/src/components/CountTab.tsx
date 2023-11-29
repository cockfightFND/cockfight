import type { ReactNode } from "react"
import { Flex, Text, Divider } from "@mantine/core"

interface Props {
  title: string
  icon: ReactNode
  count?: number
}

const CountTab = ({ title, icon, count = 0 }: Props) => {
  return (
    <Flex gap={6} align="center">
      <Flex gap={2} align="center">
        {icon}
        <Text>{title}</Text>
      </Flex>
      <Divider orientation="vertical" color="mono.2" my={4} />
      <Text>{count}</Text>
    </Flex>
  )
}

export default CountTab
