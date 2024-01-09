import { Image, Stack } from "@mantine/core"
import Lose from "./Lose.webp"
import { DRAW_POOL_CARD_SIZE, DRAW_POOL_MARGIN_TOP } from "./card"
import DrawButtons from "./DrawButtons"

const DrawFailure = () => {
  return (
    <Stack spacing={90} align="center" mt={DRAW_POOL_MARGIN_TOP}>
      <Image src={Lose} width={DRAW_POOL_CARD_SIZE} height={DRAW_POOL_CARD_SIZE} styles={{}} />
      <DrawButtons title="Try again" />
    </Stack>
  )
}

export default DrawFailure
