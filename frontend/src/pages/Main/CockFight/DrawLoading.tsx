import { useState, useEffect } from "react"
import { Box, Flex, Text, keyframes } from "@mantine/core"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import DrawPoolItem from "./DrawPoolItem"

const DrawLoading = ({ isPfp }: { isPfp: boolean }) => {
  const [init, setInit] = useState(false)
  const { pool } = useDrawPoolEntry()
  const { mainComponent } = pool
  const { token } = mainComponent
  const isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)

  const scaleUp = keyframes({
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(5)" },
    "100%": { transform: "scale(10)" },
  })

  useEffect(() => {
    setTimeout(() => setInit(true), 500)
  }, [])

  return !init ? (
    <Box pos="relative" h={isMobile ? "calc(100vh - 48px)" : 738} mx={-16} mb={-16} sx={{ overflow: "hidden" }}>
      <Box
        w={256}
        h={256}
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "17%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "linear-gradient(90deg, #543ABE 2.56%, #5830BF 100%)",
          boxShadow: `0px 2px 5px 0px hsla(0, 0%, 100%, 0.15) inset,
          0px -3px 7px 0px hsla(0, 0%, 0%, 0.16) inset, 0px 8px 8px 0px hsla(256, 68%, 25%, 0.35)`,
          animation: `${scaleUp} 500ms ease-out`,
        }}
      />
    </Box>
  ) : (
    <Flex pos="relative" direction="column" justify="center" align="center" mt={120}>
      <DrawPoolItem token={token} poolId={pool.poolId} isPfp={isPfp} />
      <Text mt={160} fz={32} c="white" fw={400} ff="Fugaz One" align="center" tt="uppercase">
        Shuffle!
      </Text>
    </Flex>
  )
}

export default DrawLoading
