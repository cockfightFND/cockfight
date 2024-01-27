import { BettingEntity, getDB } from 'orm'

export interface GetBettingListParam {
  game_id: number
}

interface GetBettingListResponse {
  bettings: BettingEntity[]
}

export async function getBettingList(
  param: GetBettingListParam
): Promise<GetBettingListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {

    const qb = queryRunner.manager.createQueryBuilder(
      BettingEntity,
      'betting'
    ).where('betting.game_id = :gameId', {
      gameId: param.game_id,
    })

    const bettings = await qb.getMany()

    return {
      bettings,
    }
  } finally {
    await queryRunner.release()
  }
}

interface PostBettingParam {
  address: string
  game_id: number
  position: number
  eggs: number
}

export async function postBetting(
  req: PostBettingParam
) {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    await queryRunner
      .manager
      .getRepository(BettingEntity)
      .save({
        address: req.address,
        gameId: req.game_id,
        position: req.position,
        eggs: req.eggs,
      })
  } finally {
    await queryRunner.release()
  }
}