import { Box, Flex, Group, Stack, Text } from "@mantine/core"
import { Link } from "react-router-dom"
import CircleImage from "../../components/CircleImage"
import { ChickenImages, EggImages } from "../Custom/items"
import { useGetModuleStore } from "../../data/query"
import { formatAmount } from "../../utils/format"
// import { formatAmount } from "../../utils/format"

const BalanceBox = ({ chickenNum, eggNum }: { chickenNum: number, eggNum: number }) => {
    const { data: moduleResponse } = useGetModuleStore()
  
    return (
    <Box
        bg="white"
        p={20}
        sx={{ 
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderRadius: 12, 
            boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)" 
        }}
    >
        <Group style={{ flex: 1 }}>
            <CircleImage src={ChickenImages.c_classic} width={40} height={40} border="2px solid black" />
            <Stack spacing="xs">
                <Text>{chickenNum}</Text>
                <Text style={{ fontSize: 'tiny', color: 'lightgray' }}>
                {formatAmount(chickenNum * parseInt(moduleResponse?.chicken_price ?? '0'))} INIT
                </Text>
            </Stack>
        </Group>

        <Group style={{ flex: 1 }}>
            <CircleImage src={EggImages.egg} width={40} height={40} border="2px solid black" />
            <Stack spacing="xs">
                <Text>{eggNum}</Text>
                <Text style={{ fontSize: 'tiny', color: 'lightgray' }}>
                    {formatAmount(eggNum * parseInt(moduleResponse?.egg_price ?? '0'))} INIT
                </Text>
            </Stack>
        </Group>
    </Box>
       
  )
}

export default BalanceBox