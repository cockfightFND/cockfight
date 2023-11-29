import { Box } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { Carousel } from "@mantine/carousel"
import type { CollectionResponse } from "@initia/marketplace-api-types"
import { useAPI } from "../../../data/api"
import { GLOBAL_PADDING } from "../../../styles/variables"
import MarketIndexGame from "./MarketIndexGame"

const GAP = 10

const MarketIndexCarousel = () => {
  const { ref, width } = useElementSize()
  const { data } = useAPI<CollectionResponse[]>("/collections?sort=VOLUME_DESC")

  return (
    <>
      <Carousel mx={-GLOBAL_PADDING} slideGap={GAP} withControls={false} slideSize={width + GAP}>
        {data?.map((game) => (
          <Carousel.Slide key={game.collectionAddress}>
            <MarketIndexGame {...game} />
          </Carousel.Slide>
        ))}
      </Carousel>

      <Box ref={ref} />
    </>
  )
}

export default MarketIndexCarousel
