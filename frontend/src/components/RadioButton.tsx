import { forwardRef } from "react"
import type { RadioProps } from "@mantine/core"
import { Radio, createPolymorphicComponent } from "@mantine/core"
import { useIsDrawMenu } from "../styles/colorScheme"

interface Props extends RadioProps {
  radioSize?: number
}

const _RadioButton = forwardRef<HTMLInputElement, Props>(({ radioSize, value, ...props }, ref) => {
  const isDrawMenu = useIsDrawMenu()
  const checkedColor = isDrawMenu ? "mono.2" : "mono.9"

  return (
    <Radio
      {...props}
      ref={ref}
      id={String(value)}
      value={value}
      styles={({ fn }) => ({
        root: {
          label: {
            color: fn.themeColor(isDrawMenu ? "mono.6" : "mono.5"),
            fontWeight: 600,
            fontSize: 14,
          },

          "&[data-checked]": {
            label: {
              color: fn.themeColor(isDrawMenu ? "mono.1" : "mono.8"),
            },
          },
        },

        radio: {
          background: "transparent",
          border: `3px solid ${fn.themeColor(isDrawMenu ? "mono.7" : "mono.3")}`,
          height: radioSize,
          width: radioSize,

          "&:checked": {
            background: "transparent",
            borderColor: fn.themeColor(checkedColor),
          },
        },

        icon: {
          color: fn.themeColor(checkedColor),
        },
      })}
    />
  )
})

const RadioButton = createPolymorphicComponent<"input", Props>(_RadioButton)

export default RadioButton
