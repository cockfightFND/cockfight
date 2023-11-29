import Bridge from './utils/Bridge';
import { Config } from 'config';
import { TxBot } from './utils/TxBot';
import { Coin } from '@initia/initia.js';
import { startBatch } from 'worker/batchSubmitter';
import { startExecutor } from 'worker/bridgeExecutor';
import { startOutput } from 'worker/outputSubmitter';
import { delay } from 'bluebird';

const config = Config.getConfig();
const SUBMISSION_INTERVAL = 5;
const FINALIZED_TIME = 5;
const DEPOSIT_AMOUNT = 1_000_000;
const DEPOSIT_INTERVAL_MS = 100;

async function setup() {
  await setupBridge(SUBMISSION_INTERVAL, FINALIZED_TIME);
}

async function setupBridge(submissionInterval: number, finalizedTime: number) {
  const bridge = new Bridge(submissionInterval, finalizedTime);
  const relayerMetadata = '';
  await bridge.deployBridge(relayerMetadata);
  console.log('Bridge deployed');
}

async function startBot() {
  try {
    await Promise.all([
      startBatch(),
      startExecutor(),
      startOutput()
    ]);
  } catch (err) {
    console.log(err);
  }
}

async function startDepositTxBot() {
  const txBot = new TxBot(config.BRIDGE_ID);
  for (;;) {
    await txBot.deposit(
      txBot.l1sender,
      txBot.l2sender,
      new Coin('uinit', DEPOSIT_AMOUNT)
    );
    await delay(DEPOSIT_INTERVAL_MS);
  }
}

async function main() {
  try {
    await setup();
    await startBot();
    await startDepositTxBot();
  } catch (err) {
    console.log(err);
  }
}

if (require.main === module) {
  main();
}
