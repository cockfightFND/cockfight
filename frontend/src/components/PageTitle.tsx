import { forwardRef } from "react"
import type { TitleProps } from "@mantine/core"
import { Title, createPolymorphicComponent } from "@mantine/core"

const _PageTitle = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  return <Title fz={28} fw={800} mb={10} ref={ref} {...props} />
})

const PageTitle = createPolymorphicComponent<"h1", TitleProps>(_PageTitle)

export default PageTitle
