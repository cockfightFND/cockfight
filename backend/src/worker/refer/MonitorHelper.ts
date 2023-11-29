import { BlockInfo, LCDClient } from '@initia/initia.js';
import { getLatestOutputFromExecutor, getOutputFromExecutor } from 'lib/query';
import { sha3_256 } from 'lib/util';
import OutputEntity from 'orm/executor/OutputEntity';
import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

class MonitorHelper {
  ///
  /// GET
  ///
  public async getSyncedState<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>,
    name: string
  ): Promise<T | null> {
    return await manager.getRepository(entityClass).findOne({
      where: { name: name } as any
    });
  }

  public async getWithdrawalTxs<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>,
    outputIndex: number
  ): Promise<T[]> {
    return await manager.getRepository(entityClass).find({
      where: { outputIndex } as any
    });
  }

  async getDepositTx<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>,
    sequence: number,
    metadata: string
  ): Promise<T | null> {
    return await manager.getRepository(entityClass).findOne({
      where: { sequence, metadata } as any
    });
  }

  public async getCoin<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>,
    metadata: string
  ): Promise<T | null> {
    return await manager.getRepository(entityClass).findOne({
      where: { l2Metadata: metadata } as any
    });
  }

  public async getLastOutputFromDB<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>
  ): Promise<T | null> {
    const lastOutput = await manager.getRepository<T>(entityClass).find({
      order: { outputIndex: 'DESC' } as any,
      take: 1
    });
    return lastOutput[0] ?? null;
  }

  public async getLastOutputIndex<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>
  ): Promise<number> {
    const lastOutput = await this.getLastOutputFromDB(manager, entityClass);
    const lastIndex = lastOutput ? lastOutput.outputIndex : 0;
    return lastIndex;
  }

  public async getOutputByIndex<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>,
    outputIndex: number
  ): Promise<T | null> {
    return await manager.getRepository<T>(entityClass).findOne({
      where: { outputIndex } as any
    });
  }

  ///
  /// SAVE
  ///
  public async saveEntity<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>,
    entity: T
  ): Promise<T> {
    return await manager.getRepository(entityClass).save(entity);
  }

  ///
  ///  UTIL
  ///

  public async fetchEvents(
    lcd: LCDClient,
    height: number,
    eventType: string
  ): Promise<any[]> {
    const searchRes = await lcd.tx.search({
      events: [{ key: 'tx.height', value: height.toString() }]
    });
    return searchRes.txs
      .flatMap((tx) => tx.logs ?? [])
      .flatMap((log) => log.events)
      .filter((evt) => evt.type === eventType);
  }
  
  public eventsToAttrMap(event: any): { [key: string]: string } {
    return event.attributes.reduce((obj, attr) => {
      obj[attr.key] = attr.value;
      return obj;
    }, {});
  }

  public parseData(attrMap: { [key: string]: string }): {
    [key: string]: string;
  } {
    return JSON.parse(attrMap['data']);
  }

  ///
  /// L1 HELPER
  ///

  ///
  /// L2 HELPER
  ///
  public calculateOutputEntity(
    outputIndex: number,
    blockInfo: BlockInfo,
    storageRoot: string,
    startBlockNumber: number,
    endBlockNumber: number
  ): OutputEntity {
    const version = outputIndex;
    const stateRoot = blockInfo.block.header.app_hash;
    const lastBlockHash = blockInfo.block_id.hash;
    const outputRoot = sha3_256(
      Buffer.concat([
        sha3_256(version),
        Buffer.from(stateRoot, 'base64'),
        Buffer.from(storageRoot, 'base64'),
        Buffer.from(lastBlockHash, 'base64')
      ])
    ).toString('base64');

    const outputEntity = {
      outputIndex,
      outputRoot,
      stateRoot,
      storageRoot,
      lastBlockHash,
      startBlockNumber,
      endBlockNumber
    };

    return outputEntity;
  }

  public async getLatestOutputFromExecutor() {
    const outputRes = await getLatestOutputFromExecutor();
    if (!outputRes.output) {
      throw new Error('No output from executor');
    }
    return outputRes.output;
  }

  public async getOutputFromExecutor(outputIndex: number) {
    const outputRes = await getOutputFromExecutor(outputIndex);
    if (!outputRes.output) {
      throw new Error('No output from executor');
    }
    return outputRes.output;
  }
}

export default MonitorHelper;
