import { Box, Flex, Group, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import CircleImage from "../../../components/CircleImage"
import { ChickenImages, EggImages } from "../../Custom/items"
import { CHICKEN_PRICE, EGG_PRICE } from "./calculate";

const MainBox = ({ eggNum, chickenNum }: { eggNum: number, chickenNum: number }) => {
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
                <Text>{chickenNum}</Text>
                </Group>
            </Group>
            <div style={{ textAlign: 'right' }}>
                <Text style={{ fontSize: 'smaller' }}>
                    {chickenNum * CHICKEN_PRICE} USDT
                </Text>
            </div>
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
                <Text style={{ textAlign: 'right' }} >{eggNum}</Text>
                </Group>
            </Group>
            <div style={{ textAlign: 'right' }}>
                <Text style={{ fontSize: 'smaller' }}>
                    {eggNum * EGG_PRICE} USDT
                </Text>
            </div>
        </Box>
    </>
    
  )
}

export default MainBox