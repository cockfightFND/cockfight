import React from "react"
import { Box, Flex, UnstyledButton } from "@mantine/core"
import Icon from "../styles/icons/Icon"

interface Props {
  onNumberPress: (number: number) => void
  onDotPress: () => void
  onBackspacePress: () => void
}

const NumButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  return (
    <UnstyledButton fz={24} fw={700} sx={{ flex: 1 }} ta="center" py={20} onClick={onClick}>
      {children}
    </UnstyledButton>
  )
}

const NumPad = ({ onNumberPress, onDotPress, onBackspacePress }: Props) => {
  return (
    <Box w="100%">
      <Flex w="100%">
        <NumButton onClick={() => onNumberPress(1)}>1</NumButton>
        <NumButton onClick={() => onNumberPress(2)}>2</NumButton>
        <NumButton onClick={() => onNumberPress(3)}>3</NumButton>
      </Flex>

      <Flex w="100%">
        <NumButton onClick={() => onNumberPress(4)}>4</NumButton>
        <NumButton onClick={() => onNumberPress(5)}>5</NumButton>
        <NumButton onClick={() => onNumberPress(6)}>6</NumButton>
      </Flex>

      <Flex w="100%">
        <NumButton onClick={() => onNumberPress(7)}>7</NumButton>
        <NumButton onClick={() => onNumberPress(8)}>8</NumButton>
        <NumButton onClick={() => onNumberPress(9)}>9</NumButton>
      </Flex>

      <Flex w="100%">
        <NumButton onClick={() => onDotPress()}>.</NumButton>
        <NumButton onClick={() => onNumberPress(0)}>0</NumButton>
        <NumButton onClick={() => onBackspacePress()}>
          <Icon.Back width={20} height={20} />
        </NumButton>
      </Flex>
    </Box>
  )
}

export default NumPad
