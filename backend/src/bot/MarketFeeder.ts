/* eslint-disable @typescript-eslint/no-unused-vars */
import { LCDClient } from '@initia/initia.js'
import { delay } from 'bluebird'
import { config } from 'config'
import { logger } from 'lib/logger'
import { getModuleStoreWithRetry } from 'lib/retry'
import { notifySlack } from 'lib/slack'
import { random } from 'lodash'
import { getDB } from 'orm'
import { DataSource, EntityManager } from 'typeorm'

export abstract class Bot {
  protected db: DataSource
  protected isRunning: boolean

  constructor() {
    ;[this.db] = getDB()
    this.isRunning = true
  }

  public stop() {
    this.isRunning = false
  }


  async getStage(): Promise<number>{
    const moduleStore = await getModuleStoreWithRetry()
    return parseInt(moduleStore.stage)
  }

  async getChickenPrice(): Promise<number> {
    // chicken
    const price = 100_000_000 + random(-1_000_000, 1_000_000, false)
    return price
  }

  async getEggPrice(): Promise<number> {
    // egg
    const price = 1_000_000 + random(-10_000, 10_000, false)
    return price
  }

  public async run(): Promise<void> {
    while (this.isRunning) {
      try {
        

        await this.db.transaction(async (manager: EntityManager) => {
        
        })
      } catch (err) {
        console.log(err)
        logger.info(err)
        this.stop()
      }
    }
  }
}
