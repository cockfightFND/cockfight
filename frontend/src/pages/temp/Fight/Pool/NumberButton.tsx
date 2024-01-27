import { formatAmount } from "@initia/utils"
import { Flex, Text, UnstyledButton } from "@mantine/core"

interface Props {
  n: number
  price: number
  isActive: boolean
  onClick: () => void
}

const NumberButton = ({ n, price, isActive, onClick }: Props) => {
  return (
    <UnstyledButton
      w={92}
      h={92}
      bg="mono.8"
      sx={({ fn, other }) => ({
        border: `2px solid ${isActive ? other.brand : fn.themeColor("mono.8")}`,
        borderRadius: "50%",
      })}
      onClick={onClick}
    >
      <Flex direction="column" justify="center" align="center">
        <Text c={isActive ? "brand" : "mono.5"} ff="Fontdiner Swanky" fw={400}>
          <Text fz={20} span inherit>
            {n}
          </Text>
          <Text fz={14} span inherit>
            x
          </Text>
        </Text>

        <Text c="white" fw={700}>
          <Text fz={14} span>
            {formatAmount(price)}
          </Text>{" "}
          <Text fz={11} span>
            INIT
          </Text>
        </Text>
      </Flex>
    </UnstyledButton>
  )
}

export default NumberButton
