import { forwardRef } from "react"
import { mergeDeepRight } from "ramda"
import type { TextInputProps } from "@mantine/core"
import { Text, TextInput, createPolymorphicComponent } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import styles, { INPUT_PADDING } from "../styles/styles"

const INPUT_FONT_SIZE = 18
const INPUT_RIGHT_SECTION_FONT_SIZE = 14

interface Props extends TextInputProps {
  unit: string
}

const _UnitInput = forwardRef<HTMLInputElement, Props>(({ unit, ...others }, ref) => {
  const rightSectionElement = useElementSize()

  return (
    <TextInput
      placeholder="0"
      inputMode="decimal"
      pattern="\d*"
      rightSection={<Text ref={rightSectionElement.ref}>{unit}</Text>}
      styles={(theme) =>
        mergeDeepRight(styles.TextInput(theme), {
          input: {
            textAlign: "right" as const,
            paddingRight: Math.ceil(rightSectionElement.width) + INPUT_PADDING + 4 /* text margin */,
          },
          rightSection: {
            color: theme.fn.themeColor(others.value ? "mono.9" : "mono.3"),
            fontSize: INPUT_RIGHT_SECTION_FONT_SIZE,
            width: "auto",
            right: INPUT_PADDING,
            top: INPUT_FONT_SIZE - INPUT_RIGHT_SECTION_FONT_SIZE,
          },
        })
      }
      ref={ref}
      {...others}
    />
  )
})

const UnitInput = createPolymorphicComponent<"input", Props>(_UnitInput)

export default UnitInput
