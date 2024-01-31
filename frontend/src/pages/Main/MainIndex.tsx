import { Stack, Title } from "@mantine/core"
import CreateAccount from "../My/Account/CreateAccount"
import { useAddress } from "../../data/account"
import GameCarousel from "./GameCarousel"
import BalanceBox from "./BalanceBox"
import { useEffect, useState } from "react"
import CountdownBox from "./CountdownBox"
import { useGetUserChickens } from "../../data/query"
import { useAPI } from "../../data/api"

const  MainIndex = () => {
  const address = useAddress()
  const [userChicken, setUserChicken] = useState<any>(null)
  const { data: myChickenRaw } = useGetUserChickens(address)
  const {refetch: refetchNextEggTime, data: nextEggTime} = useAPI<{ next_egg_time: string }>('/market/next_egg_time')
  const {refetch: refetchMarket, data: market} = useAPI<{
    markets: {
      time: string
      stage: number
      totalChickenNum: number
      totalEggNum: number
      chickenPrice: number
      eggPrice: number
    }[] 
  }>('/market', {limit:1})

  
  useEffect(() => {    
    const interval = setInterval(() => {
      refetchNextEggTime()
      refetchMarket()

    }, 1000); // 1초 간격으로 실행

    return () => clearInterval(interval);
  }, [refetchNextEggTime, refetchMarket]);

  const myChicken = address ? myChickenRaw : '0';
  if (!address) return <CreateAccount />
  
  return (
    <>
     {
      address ?
      <CreateAccount />
      :
      <Stack spacing={24}>
        <Title c="brand" ff="Fontdiner Swanky" fw={400} fz={28} mt={24} mb={16}>
          CockFight
        </Title>
        <BalanceBox chickenNum={parseInt(myChicken?? '0')} eggNum={market?.markets? market.markets[0].totalEggNum : 0}></BalanceBox>
        <GameCarousel></GameCarousel>
        <CountdownBox targetTime={nextEggTime?.next_egg_time ?? ''}></CountdownBox>
      </Stack>
     }
      
    </>
  )
}

export default MainIndex
