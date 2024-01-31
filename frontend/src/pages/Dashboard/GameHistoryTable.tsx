import { Table } from "@mantine/core"
import { useAddress } from "../../data/account"
import { useAPI } from "../../data/api"
import { BettingEntity, GameEntity } from "../Main/CockFight/types/entity"

const GameHistoryTable = () => {

  /* context */
  const address = useAddress()

  /* query */
  const { refetch: refetchBettingData, data: bettingsData } = useAPI<{ bettings: BettingEntity[]}>("/betting", { address })
  const { refetch: refetchGameData, data: gamesData } = useAPI<{ games:GameEntity[]}>("/game")

  const games = gamesData?.games || [];
  const bettings = bettingsData?.bettings || [];

  // get all games same with bettings.gameId
  const gameIds = bettings.map((betting) => betting.gameId)
  const filteredGames = games.filter((game) => gameIds.includes(game.gameId))
 
  return (
    <>
        <Table>
            <thead>
            <tr>
                <th>Game ID</th>
                <th>Betting Eggs</th>
                <th>Winner Position</th>
                <th>Betting Position</th>
                <th>Reward</th>
            </tr>
            </thead>
            <tbody>
            {filteredGames
                .sort((a, b) => b.gameId - a.gameId)
                .map((game) => (
                <tr key={game.gameId}>
                <td>{game.gameId}</td>
                <td>{bettings.find((betting) => betting.gameId === game.gameId)?.eggs}</td>
                <td>{game.winnerPosition}</td>
                <td>{bettings.find((betting) => betting.gameId === game.gameId)?.position}</td>
                <td>{bettings.find((betting) => betting.gameId === game.gameId)?.reward ?? 0}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    </>
  )
}

export default GameHistoryTable
