import { Monitor } from './Monitor';
import {
  Coin,
  MnemonicKey,
  Msg,
  MsgFinalizeTokenDeposit,
  Wallet
} from '@initia/initia.js';
import {
  ExecutorDepositTxEntity,
  ExecutorFailedTxEntity,
  ExecutorOutputEntity
} from 'orm';
import { EntityManager } from 'typeorm';
import { RPCSocket } from 'lib/rpc';
import { getDB } from '../db';
import winston from 'winston';
import { getConfig } from 'config';
import { TxWallet } from 'lib/wallet';

const config = getConfig();

export class L1Monitor extends Monitor {
  executor = new TxWallet(
    config.l2lcd,
    new MnemonicKey({ mnemonic: config.EXECUTOR_MNEMONIC })
  );

  constructor(public socket: RPCSocket, logger: winston.Logger) {
    super(socket, logger);
    [this.db] = getDB();
  }

  public name(): string {
    return 'executor_l1_monitor';
  }

  public async handleInitiateTokenDeposit(
    wallet: Wallet,
    manager: EntityManager,
    data: { [key: string]: string }
  ): Promise<MsgFinalizeTokenDeposit> {
    const lastIndex = await this.helper.getLastOutputIndex(
      manager,
      ExecutorOutputEntity
    );

    const entity: ExecutorDepositTxEntity = {
      sequence: data['l1_sequence'],
      sender: data['from'],
      receiver: data['to'],
      l1Denom: data['l1_denom'],
      l2Denom: data['l2_denom'],
      amount: data['amount'],
      data: data['data'],
      outputIndex: lastIndex + 1,
      bridgeId: this.bridgeId.toString(),
      l1Height: this.syncedHeight
    };
    await manager.getRepository(ExecutorDepositTxEntity).save(entity);

    return new MsgFinalizeTokenDeposit(
      wallet.key.accAddress,
      data['from'],
      data['to'],
      new Coin(data['l2_denom'], data['amount']),
      parseInt(data['l1_sequence']),
      this.syncedHeight,
      Buffer.from(data['data'], 'hex').toString('base64')
    );
  }

  public async handleEvents(manager: EntityManager): Promise<void> {
    const msgs: Msg[] = [];

    const depositEvents = await this.helper.fetchEvents(
      config.l1lcd,
      this.syncedHeight,
      'initiate_token_deposit'
    );

    for (const evt of depositEvents) {
      const attrMap = this.helper.eventsToAttrMap(evt);
      if (attrMap['bridge_id'] !== this.bridgeId.toString()) continue;
      const msg = await this.handleInitiateTokenDeposit(
        this.executor,
        manager,
        attrMap
      );

      if (msg) msgs.push(msg);
    }

    if (msgs.length > 0) {
      const stringfyMsgs = msgs.map((msg) => msg.toJSON().toString());
      await this.executor
        .transaction(msgs)
        .then((info) => {
          this.logger.info(
            `succeed to submit tx in height: ${this.syncedHeight}\ntxhash: ${info?.txhash}\nmsgs: ${stringfyMsgs}`
          );
        })
        .catch(async (err) => {
          const errMsg = err.response?.data
            ? JSON.stringify(err.response?.data)
            : err;
          this.logger.error(
            `Failed to submit tx in height: ${this.syncedHeight}\nMsg: ${stringfyMsgs}\n${errMsg}`
          );
          const failedTx: ExecutorFailedTxEntity = {
            height: this.syncedHeight,
            monitor: this.name(),
            messages: stringfyMsgs,
            error: errMsg
          };
          await this.helper.saveEntity(
            manager,
            ExecutorFailedTxEntity,
            failedTx
          );
        });
    }
  }
}
