/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'config'
import { CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME } from 'lib/constants'
import { MarketEntity, UserEntity } from 'orm'
import { EntityManager, TableExclusion } from 'typeorm'
import { Bot } from './Bot'
import { getAllTableEntries, getResource } from 'lib/lcd'
import { AccAddress } from '@initia/initia.js'
import { stripQuotes } from 'lib/util'
import { getModuleStoreWithRetry } from 'lib/retry'

const REWARD_FEED_INTERVAL = 60 * 1000
const YIELD_PER_CHICKEN = 2

interface Table {
  handle: string
  length: string
}


interface CockfightModuleStore {
  deposit_extend_ref: any
  prize_extend_ref: any
  deposit_store: string
  prize_store: string
  total_chickens: number
  chicken_price: number
  egg_price: number
  chickens: Table
  eggs: Table
  cock_fight: Table
}


interface ChickenMap {
  [address: AccAddress]: number

}

export class RewardFeeder extends Bot {
  async getAllUsers(manager: EntityManager): Promise<ChickenMap> {
    const cockfightMap: ChickenMap = {}
    const res = await getModuleStoreWithRetry();
    console.log(res)
    const resource = await getResource<CockfightModuleStore>(
      config.l1lcd,
      CONTRACT_HEX_ADDRESS,
      `${CONTRACT_HEX_ADDRESS}::${CONTRACT_MODULE_NAME}::ModuleStroe`,
    )
    console.log(CONTRACT_HEX_ADDRESS)
    console.log('resource:', resource)
    if (!resource) return cockfightMap

    const chickenEntries = await getAllTableEntries(
      config.l1lcd,
      resource.data.chickens.handle,
    )
    for (const entry of chickenEntries) {
      const address = AccAddress.fromHex(stripQuotes(entry.key))
      console.log(
        `${chickenEntries.indexOf(entry) + 1}/${
          chickenEntries.length
        } getting chicken for ${address}`
      )
      if (!cockfightMap[address]) cockfightMap[address] = 0
      const chicken = JSON.parse(entry.value) as any
      cockfightMap[address] = parseInt(chicken)
    }
    return cockfightMap
  }

  async feed(manager: EntityManager, time: Date): Promise<void> {
    const users = await manager.getRepository(UserEntity).find()
    if (users.length === 0) return
    for (const user of users) {
        const chicken = user.chicken;
        const eggs = chicken * YIELD_PER_CHICKEN;
        user.egg += eggs;
        await manager.getRepository(UserEntity).save(user);
    }
  }

  getFeedTime(): Date {   
    if (this.nextFeedTs == null) {
      const now = new Date();
      now.setSeconds(0, 0);
      return now 
    }
    return this.nextFeedTs 
  }

  async getNextFeedTime(time: Date): Promise<Date> {
    return new Date(time.getTime() + REWARD_FEED_INTERVAL)
  }

  public async process(manager: EntityManager): Promise<void> {
    this.nextFeedTs = this.getFeedTime()
    await this.getAllUsers(manager);
    if (this.nextFeedTs > new Date()) return
    await this.feed(manager, this.nextFeedTs);
    this.nextFeedTs = await this.getNextFeedTime(this.nextFeedTs)
  }
}
