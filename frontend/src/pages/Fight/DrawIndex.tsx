import { Title } from "@mantine/core"
import GameIndexCarousel from "./GameIndexCarousel"

const DrawIndex = () => {
  return (
    <>
      <Title c="brand" ff="Fontdiner Swanky" fw={400} fz={28} mt={24} mb={16}>
        CockFight
      </Title>

      <GameIndexCarousel></GameIndexCarousel>
    </>
  )
}

export default DrawIndex
