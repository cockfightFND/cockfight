import { useRef, memo } from "react"
import { useNavigate } from "react-router-dom"
import { Group, Image, Stack, Box, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import { formatAmount, formatPercent } from "@initia/utils"
import type { StackedCarouselSlideProps } from "react-stacked-center-carousel"
import { StackedCarousel, ResponsiveContainer } from "react-stacked-center-carousel"
import { useAPI } from "../../../data/api"
import Icon from "../../../styles/icons/Icon"
import DefaultButton from "../../../components/DefaultButton"
import ErrorMessage from "../../../components/ErrorMessage"
import { CockFight, TestCockFights } from "../../Custom/items"
 
const GameIndexCarousel = () => {
  const containerRef = useRef<StackedCarousel | undefined>()

  const data = TestCockFights;

  return (
    <Box
      sx={{
        position: "relative",
        margin: "0 -16px",
        minHeight: 486,
        width: "calc(100% + 32px)",
        ".react-stacked-center-carousel-slide-0": {
          boxShadow: "0px 0px 30px 30px #00000090",
        },
      }}
    >
      <ResponsiveContainer
        carouselRef={containerRef}
        render={(parentWidth, carouselRef) => (
          <StackedCarousel
            ref={carouselRef}
            data={data}
            carouselWidth={parentWidth}
            slideWidth={parentWidth - 50}
            slideComponent={Slide}
            maxVisibleSlide={maxVisibleCarousel(data.length)}
            useGrabCursor={true}
          />
        )}
      />
    </Box>
  )
}

export default GameIndexCarousel

const Slide = memo((props: StackedCarouselSlideProps) => {
  const navigate = useNavigate()
  const { data, dataIndex } = props
  const fight: CockFight = data[dataIndex]

  if (!fight) return null

  return (
    <Stack
      w={"100%"}
      spacing={12}
      c="black"
      bg={"mono.1"}
      p={28}
      sx={{ borderRadius: 20 }}
      pos="relative"
    >
      <Image src={fight.image} height={240} />
      
      <Stack spacing={0} align="center" sx={{ flex: "none" }}>
        <Text fz={18}>{fight.name}</Text>

        <DefaultButton
          component={Link}
          to={"./pool/" + fight.fightId}
          h={30}
          mt={8}
          onTouchEnd={() => navigate("./pool/" + fight.fightId)}
        >
          Fight!
        </DefaultButton>

        <Text fz={20} fw={800} mt={20}>
        <Text fz={16} span>
            Prize: {fight.ticket} Chicken
          </Text>
        </Text>
      </Stack>

      <Group spacing={4} pos="absolute" top={24} right={20}>
        <Text fz={12} fw={800}>
          Ticket: {fight.ticket} Eggs
        </Text>
      </Group>
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