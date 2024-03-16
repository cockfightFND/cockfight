import { useRef, memo } from "react"
import { useNavigate } from "react-router-dom"
import { Group, Image, Stack, Box, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import { formatAmount, formatPercent } from "../../utils/format"
import type { StackedCarouselSlideProps } from "react-stacked-center-carousel"
import { StackedCarousel, ResponsiveContainer } from "react-stacked-center-carousel"
// import { useAPI } from "../../../data/api"
import DefaultButton from "../../components/DefaultButton"
import { CockFight, TestCockFights } from "../Custom/items"
import { GameEntity } from "./CockFight/types/entity"
import { useAPI } from "../../data/api"
 
const GameCarousel = () => {
  const containerRef = useRef<StackedCarousel | undefined>()

  const data = TestCockFights;

  return (
    <Box
      sx={{
        position: "relative",
        margin: "0 -16px",
        width: "calc(100% + 32px)",
        backgroundColor: "transparent", // Set background color to match parent
        transition: "box-shadow 0.3s ease-in-out", // Keep the transition for any other style changes
        '&:hover': {
          boxShadow: "none", // Remove shadow on hover
        },
        // If there are any other specific styles for the parent's background, set them here
      }}
    >
      <ResponsiveContainer
        carouselRef={containerRef}
        render={(parentWidth, carouselRef) => (
          <StackedCarousel
            ref={carouselRef}
            data={data}
            carouselWidth={parentWidth}
            slideWidth={parentWidth - 150}
            slideComponent={Slide}
            maxVisibleSlide={maxVisibleCarousel(data.length)}
            useGrabCursor={true}
          />
        )}
      />
    </Box>
  )
}

export default GameCarousel

const Slide = memo((props: StackedCarouselSlideProps) => {
  const navigate = useNavigate()
  const { data, dataIndex } = props
  const fight: CockFight = data[dataIndex]
  const { data: gamesData } = useAPI<{ games:GameEntity[]}>("/game")
  const games = gamesData?.games || [];
  const targetGame = games.find(game => !game.isEnded);

  if (!fight) return null

  return (
    <Stack
      w={"100%"}
      spacing={5}
      c="black"
      bg={"mono.1"}
      p={28}
      sx={{ 
        borderRadius: 20,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', // Adjusted shadow effect
        overflow: 'hidden', // Ensure the content does not overflow
      }}
      pos="relative"
    >
      <Text size={"smaller"} sx={{ textAlign: 'right' }}> {/* Right aligned text */}
        X{fight.ticket} 
      </Text>
      <Image src={fight.image} height={200}/>
      
      <Stack spacing={0} align="center" sx={{ flex: "none" }}>
        <Text fz={18}>{fight.name}</Text>

        <DefaultButton
          component={Link}
          to={"./fight/" + targetGame?.gameId ?? 0}
          h={30}
          mt={8}
          onTouchEnd={() => navigate("./fight/" + targetGame?.gameId ?? 0)}
        >
          Fight!
        </DefaultButton>
      </Stack>
    </Stack>
  )
})

const maxVisibleCarousel = (count: number) => {
  if (count < 4) {
    if (count % 2 === 0) return count + 1
    return count
  }
  return 5
}
