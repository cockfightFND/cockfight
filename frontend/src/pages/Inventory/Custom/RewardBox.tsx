import { Box, Flex, Group, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import CircleImage from "../../../components/CircleImage"
import { ChickenImages, EggImages } from "../../Custom/items"

const RewardBox = () => {
  return (
    <>
        <Box
            component={Link}
            to={``}
            bg="white"
            p={20}
            sx={{ borderRadius: 12, boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)" }}
            >
            <Group position="apart" noWrap>
                <Group spacing={12} noWrap>
                <CircleImage src={ChickenImages.c_classic} width={40} height={40} border="2px solid black" /> 
                <Text>11361090 = 11361090 USDT</Text>
                </Group>
            </Group>
        </Box>
        <Box
            component={Link}
            to={``}
            bg="white"
            p={20}
            sx={{ borderRadius: 12, boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)" }}
            >
            <Group position="apart" noWrap>
                <Group spacing={12} noWrap>
                <CircleImage src={EggImages.egg} width={40} height={40} border="2px solid black" /> 
                <Text>11361090 = 11361090 USDT</Text>
                </Group>
            </Group>
        </Box>
    </>
    
  )
}

export default RewardBox