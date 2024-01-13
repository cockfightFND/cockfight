import { Stack } from "@mantine/core"
import PageTitle from "../../../components/PageTitle"
import MainBox from "../Custom/MainBox"
import { useEffect, useState } from "react";
import { EGG_INFLATION } from "../Custom/calculate";

const InventoryIndex = () => {
  const initialGlobalChicken = parseInt(localStorage.getItem('global_chicken') || '10000000');
  const initialGlobalEgg = parseInt(localStorage.getItem('global_egg') || '9396202929');

  const initialMyChicken = parseInt(localStorage.getItem('my_chicken') || '97');
  const initialMyEgg = parseInt(localStorage.getItem('my_egg') || '100');

  const [globalChicken, setGlobalChicken] = useState(initialGlobalChicken);
  const [globalEgg, setGlobalEgg] = useState(initialGlobalEgg);
  const [myChicken, setMyChicken] = useState(initialMyChicken);
  const [myEgg, setMyEgg] = useState(initialMyEgg);
  
  // 치킨 값이 1초마다 변경
  useEffect(() => {
      const interval = setInterval(() => {
      const randomChickenIncrement = Math.floor(Math.random() * 10) + 1;
      setGlobalChicken(prevValue => {
        const newValue = prevValue + randomChickenIncrement;
        localStorage.setItem('global_chicken', newValue.toString()); 
        return newValue;
      });

      setMyChicken(prevValue => {
        const newValue = prevValue;
        localStorage.setItem('my_chicken', newValue.toString()); 
        return newValue;
      })
      
      setGlobalEgg(prevValue => {
        const eggIncrement = EGG_INFLATION * globalChicken
        const newValue = prevValue + eggIncrement;
        localStorage.setItem('global_egg', newValue.toString());
        return newValue;
      })

      setMyEgg(prevValue => {
        const eggIncrement = EGG_INFLATION * myChicken
        const newValue = prevValue + eggIncrement;
        localStorage.setItem('my_egg', newValue.toString());
        return newValue;
      })

      }, 5000);
      return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Stack spacing={24}>
        <PageTitle>Global Pool</PageTitle>
        <MainBox chickenNum={globalChicken} eggNum={globalEgg}/>
        <PageTitle>My Pool</PageTitle>
        <MainBox chickenNum={myChicken} eggNum={myEgg}/>
      </Stack>
    </>
  )
}

export default InventoryIndex
