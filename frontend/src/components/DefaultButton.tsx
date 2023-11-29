import { forwardRef } from "react"
import type { ButtonProps } from "@mantine/core"
import { Button, createPolymorphicComponent } from "@mantine/core"

interface Props extends ButtonProps {
  invert?: boolean
}

const _DefaultButton = forwardRef<HTMLButtonElement, Props>(({ invert, h = 24, sx, ...others }, ref) => {
  const textColor = invert ? "mono.9" : "white"
  const backgroundColor = invert ? "mono.1" : "black"

  return (
    <Button
      type="button"
      bg={backgroundColor}
      c={textColor}
      fz={12}
      fw={700}
      h={h}
      sx={({ fn }) => ({
        borderRadius: typeof h === "number" ? h / 2 : undefined,
        "&:active": { background: fn.themeColor(backgroundColor) },
        ...fn.hover({ background: fn.themeColor(backgroundColor) }),
        ...sx,
      })}
      ref={ref}
      {...others}
    />
  )
})

const DefaultButton = createPolymorphicComponent<"button", Props>(_DefaultButton)

export default DefaultButton
