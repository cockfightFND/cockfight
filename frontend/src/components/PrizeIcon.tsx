import { forwardRef } from "react"
import type { FlexProps } from "@mantine/core"
import { Flex, createPolymorphicComponent } from "@mantine/core"
import Icon from "../styles/icons/Icon"

interface Props extends FlexProps {
  iconColor?: string
  iconBgColor?: string
}

const _PrizeIcon = forwardRef<HTMLDivElement, Props>(({ iconColor, iconBgColor, ...props }, ref) => {
  return (
    <Flex
      ref={ref}
      sx={({ fn }) => ({
        justifyContent: "center",
        alignItems: "center",
        width: 16,
        height: 16,
        color: fn.themeColor(iconColor ? iconColor : "brand"),
        backgroundColor: fn.themeColor(iconBgColor ? iconBgColor : "brandDark"),
        border: `1px solid ${fn.themeColor(iconColor ? iconColor : "brand")}`,
        borderRadius: "50%",
      })}
      {...props}
    >
      <Icon.Star />
    </Flex>
  )
})

const PrizeIcon = createPolymorphicComponent<"div", Props>(_PrizeIcon)

export default PrizeIcon
