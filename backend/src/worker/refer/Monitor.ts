import * as Bluebird from 'bluebird';
import { RPCSocket } from 'lib/rpc';
import { StateEntity } from 'orm';
import { DataSource, EntityManager } from 'typeorm';
import MonitorHelper from './MonitorHelper';
import winston from 'winston';
import { INTERVAL_MONITOR, getConfig } from 'config';

const config = getConfig();

export abstract class Monitor {
  public syncedHeight: number;
  protected db: DataSource;
  protected isRunning = false;
  protected bridgeId: number;
  protected l1Denom: string;
  helper: MonitorHelper = new MonitorHelper();

  constructor(public socket: RPCSocket, public logger: winston.Logger) {
    this.bridgeId = config.BRIDGE_ID;
    this.l1Denom = config.L1_DENOM;
  }

  public async run(): Promise<void> {
    const state = await this.db.getRepository(StateEntity).findOne({
      where: {
        name: this.name()
      }
    });

    if (!state) {
      await this.db
        .getRepository(StateEntity)
        .save({ name: this.name(), height: 1 });
    }
    this.syncedHeight = state?.height || 1;

    this.socket.initialize();
    this.isRunning = true;
    await this.monitor();
  }

  public stop(): void {
    this.socket.stop();
    this.isRunning = false;
  }

  public async monitor(): Promise<void> {
    while (this.isRunning) {
      try {
        const latestHeight = this.socket.latestHeight;
        if (!latestHeight || this.syncedHeight >= latestHeight) continue;
        if (this.syncedHeight % 10 == 0 && this.syncedHeight !== 1) {
          this.logger.info(`${this.name()} height ${this.syncedHeight}`);
        }
        await this.db.transaction(
          async (transactionalEntityManager: EntityManager) => {
            await this.handleEvents(transactionalEntityManager);
            await this.handleBlock(transactionalEntityManager);

            this.syncedHeight += 1;

            // update state
            await this.db
              .getRepository(StateEntity)
              .update({ name: this.name() }, { height: this.syncedHeight });
          }
        );
      } catch (err) {
        this.stop();
        console.log(err);
        this.logger.error(err);
        throw new Error(`Error in ${this.name()} ${err}`);
      } finally {
        await Bluebird.delay(INTERVAL_MONITOR);
      }
    }
  }

  // eslint-disable-next-line
  public async handleEvents(manager: EntityManager): Promise<void> {}

  // eslint-disable-next-line
  public async handleBlock(manager: EntityManager): Promise<void> {}

  // eslint-disable-next-line
  public name(): string {
    return '';
  }
}
