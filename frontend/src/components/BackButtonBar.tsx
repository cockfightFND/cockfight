import { forwardRef, type ReactNode } from "react"
import type { FlexProps } from "@mantine/core"
import { Box, createPolymorphicComponent, Flex, Title } from "@mantine/core"
import { GLOBAL_PADDING } from "../styles/variables"
import BackButton from "./BackButton"

interface Props extends FlexProps {
  to?: string
  backReplace?: boolean
  label?: ReactNode
  actions?: ReactNode
  buttonColor?: string
}

const _BackButtonBar = forwardRef<HTMLDivElement, Props>(
  ({ to, backReplace, label, actions, buttonColor, ...others }, ref) => {
    return (
      <Flex justify="center" align="center" pos="relative" h={2 * GLOBAL_PADDING + 16} ref={ref} {...others}>
        <BackButton to={to} replace={backReplace} c={buttonColor} pos="absolute" top={0} left={0} />

        <Title fz={16} fw={800}>
          {label}
        </Title>

        {actions && (
          <Box c={buttonColor} pos="absolute" top={0} right={0}>
            {actions}
          </Box>
        )}
      </Flex>
    )
  },
)

const BackButtonBar = createPolymorphicComponent<"div", Props>(_BackButtonBar)

export default BackButtonBar
