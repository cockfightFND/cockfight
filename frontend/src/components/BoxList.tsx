import type { ReactNode } from "react"
import { forwardRef, Fragment } from "react"
import type { BoxProps } from "@mantine/core"
import { Box, Divider, Group, Stack, Text, createPolymorphicComponent } from "@mantine/core"

interface Data {
  title: string
  content: ReactNode
}

interface Props extends BoxProps {
  list: Data[]
}

const _BoxList = forwardRef<HTMLDivElement, Props>(({ list, ...others }, ref) => {
  return (
    <Box ref={ref} {...others}>
      <Group noWrap bg="mono.9" position="apart" p={12} sx={{ borderRadius: 8, overflow: "auto" }}>
        {list.map(({ title, content }, index) => (
          <Fragment key={index}>
            {!!index && <Divider color="mono.7" orientation="vertical" h={18} sx={{ alignSelf: "center" }} />}
            <Stack align="center" spacing={3} m="auto">
              <Text tt="uppercase" c="mono.5" fw={600} fz={11}>
                {title}
              </Text>
              <Text c="mono.1" fw={700} fz={14}>
                {content}
              </Text>
            </Stack>
          </Fragment>
        ))}
      </Group>
    </Box>
  )
})

const BoxList = createPolymorphicComponent<"div", Props>(_BoxList)

export default BoxList
