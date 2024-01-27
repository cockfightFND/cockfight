import { forwardRef } from "react"
import type { TabsProps } from "@mantine/core"
import { Tabs, createPolymorphicComponent } from "@mantine/core"

const _MyIndexTabComponent = forwardRef<HTMLDivElement, TabsProps>((others, ref) => {
  return (
    <Tabs
      variant="pills"
      styles={({ fn }) => ({
        tab: {
          background: fn.themeColor("mono.1"),
          borderRadius: 14,
          color: fn.themeColor("mono.3"),
          fontSize: 12,
          fontWeight: 700,
          height: 28,
          padding: "0 12px",
          textTransform: "uppercase",

          ...fn.hover({ background: fn.themeColor("mono.1") }),

          "&[data-active]": {
            background: "white",
            boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)",
            color: fn.themeColor("mono.9"),

            ...fn.hover({ background: "white" }),
          },
        },
        panel: { paddingTop: 26 },
      })}
      ref={ref}
      {...others}
    />
  )
})

const MyIndexTabComponent = createPolymorphicComponent<"div", TabsProps>(_MyIndexTabComponent)

export default MyIndexTabComponent
