import { MsgCreateBridge, BridgeConfig, Duration } from '@initia/initia.js';
import { getDB, initORM } from 'worker/db';
import { DataSource, EntityManager } from 'typeorm';
import {
  ExecutorOutputEntity,
  StateEntity,
  ExecutorWithdrawalTxEntity,
  ExecutorDepositTxEntity,
  ExecutorFailedTxEntity
} from 'orm';
import { executor, challenger, outputSubmitter } from './helper';
import { sendTx } from 'lib/tx';

class Bridge {
  db: DataSource;
  l1BlockHeight: number;
  l2BlockHeight: number;

  constructor(public submissionInterval: number, public finalizedTime: number) {
    [this.db] = getDB();
  }

  async init() {
    await this.setDB();
  }

  async setDB() {
    // remove and initialize
    const l1Monitor = `executor_l1_monitor`;
    const l2Monitor = `executor_l2_monitor`;
    await this.db.transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.getRepository(StateEntity).clear();
        await transactionalEntityManager
          .getRepository(ExecutorWithdrawalTxEntity)
          .clear();
        await transactionalEntityManager
          .getRepository(ExecutorOutputEntity)
          .clear();
        await transactionalEntityManager
          .getRepository(ExecutorDepositTxEntity)
          .clear();
        await transactionalEntityManager
          .getRepository(ExecutorFailedTxEntity)
          .clear();

        await transactionalEntityManager
          .getRepository(StateEntity)
          .save({ name: l1Monitor, height: 1 });
        await transactionalEntityManager
          .getRepository(StateEntity)
          .save({ name: l2Monitor, height: 1 });
      }
    );
  }

  MsgCreateBridge(
    submissionInterval: number,
    finalizedTime: number,
    metadata: string
  ) {
    const bridgeConfig = new BridgeConfig(
      challenger.key.accAddress,
      outputSubmitter.key.accAddress,
      Duration.fromString(submissionInterval.toString()),
      Duration.fromString(finalizedTime.toString()),
      new Date(),
      metadata
    );
    return new MsgCreateBridge(executor.key.accAddress, bridgeConfig);
  }

  async tx(metadata: string) {
    const msgs = [
      this.MsgCreateBridge(
        this.submissionInterval,
        this.finalizedTime,
        metadata
      )
    ];

    return await sendTx(executor, msgs);
  }

  async deployBridge(metadata: string) {
    await initORM();
    const bridge = new Bridge(this.submissionInterval, this.finalizedTime);
    await bridge.init();
    return await bridge.tx(metadata);
  }
}

export default Bridge;
