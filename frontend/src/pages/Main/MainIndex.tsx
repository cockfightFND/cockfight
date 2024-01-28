import { Stack, Title } from "@mantine/core"
import CreateAccount from "../My/Account/CreateAccount"
import { useAddress } from "../../data/account"
import GameCarousel from "./GameCarousel"
import BalanceBox from "./BalanceBox"
import { useEffect, useState } from "react"
import CountdownBox from "./CountdownBox"

const MainIndex = () => {
  const address = useAddress()
  const [myChicken, setMyChicken] = useState(0);
  const [myEgg, setMyEgg] = useState(0);

  // 치킨 값이 1초마다 변경
  useEffect(() => {
    const interval = setInterval(() => {

    }, 3000);
    return () => clearInterval(interval);
  }, []);


  if (!address) return <CreateAccount />

  


  return (
    <>
      <Stack spacing={24}>
        <Title c="brand" ff="Fontdiner Swanky" fw={400} fz={28} mt={24} mb={16}>
          CockFight
        </Title>
        <BalanceBox chickenNum={myChicken} eggNum={myEgg}></BalanceBox>
        <GameCarousel></GameCarousel>
        <CountdownBox targetTime="2024-02-10T15:00:00"></CountdownBox>
      </Stack>
    </>
  )
}

export default MainIndex
