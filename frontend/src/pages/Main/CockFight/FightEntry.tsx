import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { modals } from "@mantine/modals"
import BigNumber from "bignumber.js"
import axios from "axios"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { TicketStatus } from "@initia/marketplace-api-types"
import type { PoolResponse, TicketResponse } from "@initia/marketplace-api-types"
import { API_URL, MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import { useAPI } from "../../../data/api"
import { useAddress, useBalance, useSignAndBroadcastTxSync } from "../../../data/account"
import { GLOBAL_PADDING } from "../../../styles/variables"
import ErrorModalContent from "../../../components/ErrorModalContent"
import BackButtonBar from "../../../components/BackButtonBar"
import { useHideNavigation } from "../../../app/hooks"
import { DrawPoolEntryProvider } from "./DrawPoolEntryContext"
import DrawIdle from "./DrawIdle"
import DrawLoading from "./DrawLoading"
import DrawSuccess from "./DrawSuccess"
import DrawFailure from "./DrawFailure"
import CountdownBox from "../CountdownBox"
import { Box, Button, Group, Stack, Table, Text } from "@mantine/core"
import { BettingEntity, GameEntity, UserEntity } from "./types/entity"
import BackButton from "../../../components/BackButton"

interface FormValues {
  address: string
  game_id: number
  position: number
  eggs: number
}

const FightEntry = () => {
  useHideNavigation()

  // const [userData, setUserData] = useState<UserEntity[]>([])
  /* context */
  const address = useAddress()

  /* query */
  const { id } = useParams()
  const { refetch: refetchBettingData, data: bettingsData } = useAPI<{ bettings: BettingEntity[]}>("/betting", { game_id: id })
  const { refetch: refetchGameData, data: gamesData } = useAPI<{ games:GameEntity[]}>("/game")
  const { refetch: refetchUserData, data: userData } = useAPI<{ users: UserEntity[] }>("/user", {address})

  /* submit */
  const { mutate, isSuccess, isLoading, reset } = useMutation({
    mutationFn: async ( {address, game_id, position, eggs} : FormValues) => {
      console.log({address, game_id, position, eggs})
      const res = await axios.post("/betting", {
        address,
        game_id,
        position,
        eggs
      }, { baseURL: API_URL })
      return res
    },
    onSuccess: (data) => {
      modals.open({
        title: "Success",
        children: <Text>Transaction has been sent</Text>,
        onClose: reset,
      })
    },
    onError: (error) => {
      modals.open({
        title: "Something went wrong",
        children: <ErrorModalContent error={error} />,
        onClose: reset,
      })
    },
  })


  const bettings = bettingsData?.bettings || [];
  const games = gamesData?.games || [];
  const users = userData?.users || [];

  const targetGame = games.find(game => !game.isEnded);
  const totalPosition: { [key: number]: number } = bettings.reduce((acc, curr) => {
    if (curr.gameId !== targetGame?.gameId) return acc;  
    acc[curr.position] = (acc[curr.position] || 0) + curr.eggs;
    return acc;
  }, {});
  const positions = targetGame ? Array.from({ length: targetGame.positionNum }, (_, i) => i + 1) : [];
  const bettingEggs = [10, 50, 100];

  useEffect(() => {
    
    const interval = setInterval(() => {
      refetchBettingData();
      refetchGameData();
      refetchUserData();
      if (targetGame?.gameId && Number(id) !== targetGame?.gameId) {
        window.location.href = './'+ targetGame?.gameId; // Redirect to a different page
      }
    }, 1000); // 1초 간격으로 실행

    return () => clearInterval(interval);
  }, [id, targetGame?.gameId, refetchBettingData, refetchGameData, refetchUserData]);

  return (
    <>
      <BackButton/>
      <Stack spacing={24}>
        {targetGame && (
          <Box mb="md">
            <Text>Game ID: {targetGame.gameId}</Text>
          </Box>
        )}
        
        {positions.map((position) => (
          <Button 
            key={position} variant="outline" size="lg" fullWidth 
            style={{ height: '100px' }}
          >
            <Stack spacing={0} align="center">
              <Text>{position}</Text>
              <Text size="sm">Total: {totalPosition[position] ?? 0}</Text>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {bettingEggs.map((bettingEgg) => (
                  <Button
                    key={bettingEgg}
                    size="s"
                    radius="xl"
                    color="yellow"
                    style={{ fontSize: 10, marginRight: 12, marginTop: 12, padding: '10px 20px' }}
                    onClick={() => mutate({address, game_id: targetGame?.gameId ?? 0, position, eggs: bettingEgg})}
                  >
                    {bettingEgg}
                  </Button>
                ))}
            </div>
            </Stack>
          </Button>
        ))}
        <CountdownBox targetTime={targetGame?.endTime.toString() ?? ''}></CountdownBox>
        <Box mt="md">
        <Text size="lg" weight={700} mb="sm">
          My Eggs: { users.length !== 0 ? users[0].egg : 0}
        </Text>
        <Table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Position</th>
              <th>Total Eggs</th>
            </tr>
          </thead>
          <tbody>
            {bettings
              .slice() // Create a copy of the array to avoid modifying the original
              .sort((a, b) => (b.eggs ?? 0) - (a.eggs ?? 0)) // Sort in descending order based on eggs
              .map((betting) => (
                <tr key={betting}>
                  <td>{betting.address}</td>
                  <td>{betting.position}</td>
                  <td>{betting.eggs ?? 0}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Box>
      </Stack>
    </>
  )
}

export default FightEntry
