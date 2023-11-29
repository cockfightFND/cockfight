import { forwardRef } from "react"
import type { FlexProps } from "@mantine/core"
import { Flex, createPolymorphicComponent, useMantineTheme } from "@mantine/core"
import { ReactComponent as CheckIcon } from "./Check.svg"

interface Props extends FlexProps {
  checked: boolean
}

const _Check = forwardRef<HTMLDivElement, Props>(({ checked, ...others }, ref) => {
  const { fn } = useMantineTheme()

  return (
    <Flex c={checked ? "black" : fn.themeColor("mono.3")} ff="monospace" ref={ref} {...others}>
      <CheckIcon width={16} height={16} />
    </Flex>
  )
})

const Check = createPolymorphicComponent<"div", Props>(_Check)

export default Check
