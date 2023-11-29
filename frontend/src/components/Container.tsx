import { forwardRef } from "react"
import type { BoxProps } from "@mantine/core"
import { Box, createPolymorphicComponent } from "@mantine/core"
import { MAX_WIDTH, MIN_WIDTH } from "../styles/variables"

const _Container = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <Box miw={MIN_WIDTH} maw={MAX_WIDTH} mx="auto" ref={ref} {...props} />
})

const Container = createPolymorphicComponent<"div", BoxProps>(_Container)

export default Container
