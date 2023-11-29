import { RPCSocket } from 'lib/rpc';
import { Monitor } from './refer/Monitor';
import { executorController } from 'controller';

import { executorLogger as logger } from 'lib/logger';
import { initORM, finalizeORM } from './db';
import { initServer, finalizeServer } from 'loader';
import { once } from 'lodash';
import { getConfig } from 'config';

const config = getConfig();
let monitors: Monitor[];

async function runBot(): Promise<void> {
  monitors = [
  ];
  try {
    await Promise.all(
      monitors.map((monitor) => {
        monitor.run();
      })
    );
  } catch (err) {
    logger.error(err);
    stopExecutor();
  }
}

function stopBot(): void {
  monitors.forEach((monitor) => monitor.stop());
}

export async function stopExecutor(): Promise<void> {
  stopBot();

  logger.info('Closing listening port');
  finalizeServer();

  logger.info('Closing DB connection');
  await finalizeORM();

  logger.info('Finished Executor');
  process.exit(0);
}

export async function startExecutor(): Promise<void> {
  try {
    await initORM();
    await initServer(executorController, config.EXECUTOR_PORT);
    await runBot();
  } catch (err) {
    throw new Error(err);
  }

  // attach graceful shutdown
  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'] as const;
  signals.forEach((signal) => process.on(signal, once(stopExecutor)));
}

if (require.main === module) {
  startExecutor().catch(console.log);
}

export { monitors };
