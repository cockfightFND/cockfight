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