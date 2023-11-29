import type { PropsWithChildren } from "react"
import { useEffect } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import type { BoxProps } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { GLOBAL_PADDING } from "../styles/variables"
import { fixedBottomHeightState, navigationBarHeightState } from "../app/hooks"
import Container from "./Container"

const FixedBottom = (props: PropsWithChildren<BoxProps>) => {
  const navigationBarHeight = useRecoilValue(navigationBarHeightState)
  const { ref, height } = useElementSize()
  const setFixedBottomHeight = useSetRecoilState(fixedBottomHeightState)

  useEffect(() => {
    setFixedBottomHeight(height)
    return () => setFixedBottomHeight(0)
  }, [height, setFixedBottomHeight])

  return (
    <Container
      pos="fixed"
      bottom={navigationBarHeight}
      left={0}
      right={0}
      p={GLOBAL_PADDING}
      sx={{ zIndex: 1 }}
      ref={ref}
      {...props}
    />
  )
}

export default FixedBottom
