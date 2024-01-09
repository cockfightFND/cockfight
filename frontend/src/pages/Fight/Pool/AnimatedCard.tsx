import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"
import { Box, Image, keyframes } from "@mantine/core"

const DURATION_IN_MS = 1000

const flip = keyframes({
  "0%": { transform: "rotateX(0deg)", animationTimingFunction: "ease-in-out" },
  "50%": { transform: "rotateX(-180deg)", animationTimingFunction: "ease-in-out" },
  "100%": { transform: "rotateX(-360deg)" },
})

interface Item {
  src: string
  backgroundColor?: string
}

const AnimatedCard = ({
  list,
  size,
  radius,
  isPfp,
}: {
  list: Item[]
  size: string
  radius: number
  isPfp?: boolean
}) => {
  const [frontMounted, setFrontMounted] = useState(false)
  const [backMounted, setBackMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setFrontMounted(true), DURATION_IN_MS * 0.5)
    setTimeout(() => setBackMounted(true), DURATION_IN_MS * 1)
  }, [])

  const [frontIndex, setFrontIndex] = useState(0)
  const [backIndex, setBackIndex] = useState(1)

  useUpdateIndex({
    isMounted: frontMounted,
    setIndex: setFrontIndex,
    listLength: list.length,
  })

  useUpdateIndex({
    isMounted: backMounted,
    setIndex: setBackIndex,
    listLength: list.length,
  })

  const renderFacade = ({ src, backgroundColor = "white" }: Item, back?: boolean) => {
    return (
      <Image
        src={src}
        sx={{
          backgroundColor,
          borderRadius: radius,
          position: "absolute",
          left: 0,
          top: 0,
          backfaceVisibility: "hidden",
          transform: back ? "rotateX(180deg)" : undefined,
          overflow: "hidden",
          ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
        }}
        width={size}
        height={size}
      />
    )
  }

  return (
    <Box
      sx={{
        perspective: 1000,
        width: size,
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          animation: `${flip} ${DURATION_IN_MS}ms linear infinite`,
          transformStyle: "preserve-3d",
          position: "relative",
          height: size,
        }}
      >
        {renderFacade(list[frontIndex])}
        {renderFacade(list[backIndex] ?? list[frontIndex], true)}
      </Box>
    </Box>
  )
}

export default AnimatedCard

/* helper */
interface UseUpdateIndexProps {
  isMounted: boolean
  setIndex: Dispatch<SetStateAction<number>>
  listLength: number
}

function useUpdateIndex({ isMounted, setIndex, listLength }: UseUpdateIndexProps) {
  useEffect(() => {
    if (!isMounted) return

    setIndex((prev) => (prev + 2) % listLength)

    const id = setInterval(() => {
      setIndex((prev) => (prev + 2) % listLength)
    }, DURATION_IN_MS)

    return () => clearInterval(id)
  }, [isMounted, listLength, setIndex])
}
