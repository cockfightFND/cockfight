import type { ReactNode } from "react"
import { Group, Text } from "@mantine/core"

const MarketItemDetailsTag = ({ title, content, icon }: { title: string; content: string; icon?: ReactNode }) => (
  <Group spacing={4} display="inline-flex" bg="mono.1" fw={600} px={8} sx={{ borderRadius: 26 / 2, height: 26 }} mt={8}>
    {icon && <Text c="mono.5">{icon}</Text>}
    <Text c="mono.5" fz={11}>
      {title}
    </Text>
    <Text c="mono.7" fz={14}>
      {content}
    </Text>
  </Group>
)

export default MarketItemDetailsTag
