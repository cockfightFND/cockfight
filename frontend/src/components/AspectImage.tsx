import { forwardRef } from "react"
import type { BoxProps } from "@mantine/core"
import { AspectRatio, BackgroundImage, Box, createPolymorphicComponent } from "@mantine/core"
import { IMAGE_PADDING } from "../styles/variables"

interface Props extends BoxProps {
  src: string
  isPfp?: boolean
}

const _AspectImage = forwardRef<HTMLImageElement, Props>(({ src, isPfp, ...props }, ref) => (
  <Box p={isPfp ? 0 : IMAGE_PADDING} ref={ref} {...props}>
    <AspectRatio ratio={1}>
      <BackgroundImage src={src} sx={{ backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
    </AspectRatio>
  </Box>
))

const AspectImage = createPolymorphicComponent<"img", Props>(_AspectImage)

export default AspectImage
