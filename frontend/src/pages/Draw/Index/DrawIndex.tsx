import { Title } from "@mantine/core"
import DrawIndexCarousel from "./DrawIndexCarousel"
import DrawIndexGameList from "./DrawIndexGameList"

const DrawIndex = () => {
  return (
    <>
      <Title c="brand" ff="Fontdiner Swanky" fw={400} fz={28} mt={24} mb={16}>
        CockFight
      </Title>

      <DrawIndexCarousel />
      {/* <DrawIndexGameList /> */}
    </>
  )
}

export default DrawIndex
