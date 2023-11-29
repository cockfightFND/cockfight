import { forwardRef } from "react"
import type { ImageProps, MantineTheme } from "@mantine/core"
import { Image, createPolymorphicComponent } from "@mantine/core"

interface Props extends ImageProps {
  border?: string | ((theme: MantineTheme) => string)
}

const _CircleImage = forwardRef<HTMLImageElement, Props>(({ border, ...props }, ref) => (
  <Image
    radius="50%"
    fit="cover"
    styles={(theme) => ({
      image: { border: `${typeof border === "string" ? border : border?.(theme)}` },
      placeholder: {
        backgroundColor: theme.fn.themeColor("mono.0"),
        div: {
          display: "flex",
          justifyContent: "center",
          svg: {
            width: "50% !important",
            height: "50% !important",
          },
        },
      },
    })}
    ref={ref}
    {...props}
  />
))

const CircleImage = createPolymorphicComponent<"img", Props>(_CircleImage)

export default CircleImage
