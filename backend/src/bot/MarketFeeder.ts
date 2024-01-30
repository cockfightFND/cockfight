/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'config'
import { CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME } from 'lib/constants'
import { MarketEntity } from 'orm'
import { EntityManager } from 'typeorm'
import { Bot } from './Bot'
import { getModuleStoreWithRetry } from 'lib/retry'

const MARKET_FEED_INTERVAL = 60 * 1000

export class MarketFeeder extends Bot {
  async getLastMarketEntity(manager: EntityManager): Promise<MarketEntity | null> {
    const marketEntity = await manager.getRepository(MarketEntity).find({
      order: { time: 'DESC', } as any,
      take: 1
    })

    return marketEntity[0] ?? null
  }

  async getFeedTime(manager: EntityManager): Promise<Date> {
    const marketEntity = await this.getLastMarketEntity(manager)

    if (!marketEntity) {
      const now = new Date();
      now.setSeconds(0, 0);
      return now
    }
    return marketEntity.time
  }

  getNextFeedTime(time: Date): Date {
    return new Date(time.getTime() + MARKET_FEED_INTERVAL)
  }


  async getNextStage(manager: EntityManager): Promise<number>{
    const marketEntity = await this.getLastMarketEntity(manager)

    if (!marketEntity) {
      return 1
    }
    return marketEntity.stage + 1
  }

  async feed(manager: EntityManager, time: Date): Promise<void> {
    const moduleStore = await getModuleStoreWithRetry();

    const entity: MarketEntity = {
      time: this.getNextFeedTime(time),
      stage: await this.getNextStage(manager),
      totalChickenNum: parseInt(moduleStore.total_chicken),
      totalEggNum: parseInt(moduleStore.total_chicken) * 10,
      chickenPrice: parseInt(moduleStore.chicken_price),
      eggPrice: parseInt(moduleStore.egg_price),
    }

    await manager.getRepository(MarketEntity).save(entity)
  }

  public async process(manager: EntityManager): Promise<void> {
    this.nextFeedTs = new Date(await this.getFeedTime(manager))
    if (this.nextFeedTs > new Date()) return
    await this.feed(manager, this.nextFeedTs);
  }
}
