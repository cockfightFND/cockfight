import { REWARD_FEED_INTERVAL } from 'bot/RewardFeeder'
import { MarketEntity, getDB } from 'orm'

export interface GetMarketListParam {
  time?: string
  limit: number
}

interface GetMarketListResponse {
  markets: MarketEntity[]
}

export async function getMarketList(
  param: GetMarketListParam
): Promise<GetMarketListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const limit = Number(param.limit) ?? 20

    const qb = queryRunner.manager.createQueryBuilder(
      MarketEntity,
      'market'
    )
    
    if (param.time) {
      qb.where('market.time <= :time', { time: param.time })
    }
    
    const markets = await qb
      .orderBy('market.time', 'DESC')
      .limit(limit)
      .getMany()

    return {
      markets
    }
  } finally {
    await queryRunner.release()
  }
}

interface GetNextEggTimeResponse {
  next_egg_time: string
}

export async function getNextEggTime(
): Promise<GetNextEggTimeResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const qb = queryRunner.manager.createQueryBuilder(
      MarketEntity,
      'market'
    )
    
    const marketEntity = await qb
      .orderBy('market.time', 'DESC')
      .getOne()
    if (!marketEntity) throw new Error('market not found')

    const time = new Date(marketEntity.time);
    const next_egg_time = new Date(time.getTime())
    return {
      next_egg_time : next_egg_time.toISOString()
    }
  } finally {
    await queryRunner.release()
  }
}

