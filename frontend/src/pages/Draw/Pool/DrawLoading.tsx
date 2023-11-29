import { useMemo } from "react"
import { Flex } from "@mantine/core"
import { DRAW_POOL_CARD_RADIUS, DRAW_POOL_CARD_SIZE, DRAW_POOL_MARGIN_TOP } from "./card"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import AnimatedCard from "./AnimatedCard"

const DrawLoading = ({ isPfp }: { isPfp: boolean }) => {
  const { pool } = useDrawPoolEntry()
  const { components = [] } = pool

  const list = useMemo(() => {
    const list = components?.map(({ token: { backgroundColor, imageUrl } }) => {
      return { src: imageUrl + "/public", backgroundColor }
    })

    return list?.filter((item, index) => {
      return list.findIndex((item2) => item.src === item2.src) === index
    })
  }, [components])

  return (
    <Flex justify="center" align="center" mt={DRAW_POOL_MARGIN_TOP}>
      <AnimatedCard list={list} size={DRAW_POOL_CARD_SIZE} radius={DRAW_POOL_CARD_RADIUS} isPfp={isPfp} />
    </Flex>
  )
}

export default DrawLoading
