import { forwardRef } from "react"
import type { ButtonProps } from "@mantine/core"
import { Button, createPolymorphicComponent } from "@mantine/core"

interface Props extends ButtonProps {
  invert?: boolean
}

const _SubmitButton = forwardRef<HTMLButtonElement, Props>(({ invert, ...others }, ref) => {
  const textColor = invert ? "black" : "mono.0"
  const backgroundColor = invert ? "white" : "black"

  return (
    <Button
      type="submit"
      bg={backgroundColor}
      c={textColor}
      fz={18}
      fw={800}
      h={52}
      sx={(theme) => ({
        border: `2px solid ${invert ? theme.fn.themeColor(textColor) : backgroundColor}`,
        borderRadius: 52 / 2,
        ...theme.fn.hover({ background: backgroundColor }),
      })}
      fullWidth
      ref={ref}
      {...others}
    />
  )
})

const SubmitButton = createPolymorphicComponent<"button", Props>(_SubmitButton)

export default SubmitButton
