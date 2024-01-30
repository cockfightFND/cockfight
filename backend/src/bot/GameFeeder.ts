/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'config'
import { CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME } from 'lib/constants'
import { BettingEntity, GameEntity } from 'orm'
import { EntityManager } from 'typeorm'
import { Bot } from './Bot'

const GAME_FEED_INTERVAL = 5 * 60 * 1000

export class GameFeeder extends Bot {
  async getLastGameEntity(manager: EntityManager): Promise<GameEntity | null> {
    const gameEntity = await manager.getRepository(GameEntity).find({
      order: { gameId: 'DESC', } as any,
      take: 1
    })
    return gameEntity[0] ?? null
  }

  async calculateWinnerPosition(manager: EntityManager, gameId: number): Promise<number | null> {
    const bettings = await manager.getRepository(BettingEntity).find({
      where: { gameId }
    })

    const positionCount = {}
    let minPosition: number | null = null;
    let minCount = Infinity;

    for (const betting of bettings) {
      if (!positionCount[betting.position]) {
        positionCount[betting.position] = 0
      }
      positionCount[betting.position] += 1

      if (positionCount[betting.position] < minCount) {
        minCount = positionCount[betting.position]
        minPosition = betting.position
      }
    }

    if (!minPosition) return null
    return minPosition 
  }

  async createGame(manager: EntityManager, time: Date): Promise<void> {
    const lastGameEntity = await this.getLastGameEntity(manager)
    const gameId = lastGameEntity ? lastGameEntity.gameId + 1 : 1
    const game: GameEntity = {
      gameId,
      positionNum: 2,
      winnerPosition: null,
      endTime: this.getNextFeedTime(time),
      isEnded: false
    }
    await manager.getRepository(GameEntity).save(game)
  }

  async endGame(manager: EntityManager): Promise<void> {
    const games = await manager.getRepository(GameEntity).find({
      where: { isEnded: false }
    })
    if (games.length === 0) return

    const now = new Date()
    for (const game of games) {
      if (game.endTime < now) {
        const winnerPosition = await this.calculateWinnerPosition(manager, game.gameId)
        if (!winnerPosition) continue
        await manager.getRepository(GameEntity).save({
          ...game,
          isEnded: true,
          winnerPosition
        })

        // give reward for winner 
      }
    }
  }

  async getFeedTime(manager: EntityManager): Promise<Date> {
    const gameEntity = await this.getLastGameEntity(manager)

    if (!gameEntity) {
      const now = new Date();
      now.setSeconds(0, 0);
      return now
    }
    return gameEntity.endTime
  }

  getNextFeedTime(time: Date): Date {
    return new Date(time.getTime() + GAME_FEED_INTERVAL)
  }

  public async process(manager: EntityManager): Promise<void> {
    this.nextFeedTs = new Date(await this.getFeedTime(manager))
    await this.endGame(manager)
    
    if (this.nextFeedTs > new Date()) return
    await this.createGame(manager, this.nextFeedTs)
  }
}
