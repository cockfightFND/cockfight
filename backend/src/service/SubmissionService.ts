import { BettingEntity, StateEntity, getDB } from 'orm'
import { config } from 'config'
import { operator, setMerkleRoot } from 'lib/wallet'
import { Betting } from 'types'
import { BettingStorage } from 'lib/storage'

export interface PostSubmissionParam {
  game_id: number
  winner_position: number
}

export async function postSubmission(req: PostSubmissionParam) {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const state =await queryRunner
      .manager
      .getRepository(StateEntity)
      .findOne({
        where: {
          name: 'state',
        },
      })
    
    if (!state) {
      await queryRunner.manager.getRepository(StateEntity).save({
        name: 'state',
        gameId: req.game_id,
        prizeAmount: config.PRIZE_AMOUNT,
      })
      return
    } else {
      await queryRunner.manager.getRepository(StateEntity).save({
        name: 'state',
        gameId: req.game_id + 1,
        prizeAmount: config.PRIZE_AMOUNT,
      })
    }

    
    const bettingQb = await queryRunner
      .manager
      .createQueryBuilder(BettingEntity,'betting')
      .where('betting.game_id = :gameId', {
        gameId: state.gameId,
      })
      .getMany()
    
    const bettings: Betting[]  = bettingQb.map((entity)=> {
      return {
        address: entity.address,
        gameId: entity.gameId,
        position: entity.position,
        eggs: entity.eggs,
      }
    })
    
    const bettingStorage = new BettingStorage(bettings)
    const bettingMerkleRoot = bettingStorage.getMerkleRoot()

    for (const betting of bettings) {
      await queryRunner.manager.getRepository(BettingEntity)
        .save({
          address: betting.address,
          gameId: betting.gameId,
          position: betting.position,
          eggs: betting.eggs,
          merkleRoot: bettingMerkleRoot,
          merkleProof: bettingStorage.getMerkleProof(betting),
        })
    }

    if (bettings.length === 0) return
    
    await operator.transaction([
      setMerkleRoot(
        state.gameId,
        state.prizeAmount,
        req.winner_position,
        bettingMerkleRoot,
      )
    ])

  } finally {
    await queryRunner.release()
  }
}
