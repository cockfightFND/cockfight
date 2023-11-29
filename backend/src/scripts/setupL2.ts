import { MsgCreateBridge, BridgeConfig, Duration } from '@initia/initia.js';
import { sendTx } from 'lib/tx';
import { getConfig } from 'config';
import { executor, challenger, outputSubmitter } from 'test/utils/helper';

const config = getConfig();
const SUBMISSION_INTERVAL = 10;
const FINALIZED_TIME = 10;
const IBC_METADATA = 'ibc_channel';

class L2Initializer {
  l2id = config.BRIDGE_ID;

  constructor(
    public submissionInterval: number,
    public finalizedTime: number,
    public metadata: string
  ) {}

  MsgCreateBridge(submissionInterval: number, finalizedTime: number) {
    const bridgeConfig = new BridgeConfig(
      challenger.key.accAddress,
      outputSubmitter.key.accAddress,
      Duration.fromString(submissionInterval.toString()),
      Duration.fromString(finalizedTime.toString()),
      new Date(),
      this.metadata
    );
    return new MsgCreateBridge(executor.key.accAddress, bridgeConfig);
  }

  async initialize() {
    const msgs = [
      this.MsgCreateBridge(this.submissionInterval, this.finalizedTime)
    ];

    await sendTx(executor, msgs);
  }
}

async function main() {
  const initializer = new L2Initializer(
    SUBMISSION_INTERVAL,
    FINALIZED_TIME,
    IBC_METADATA
  );
  console.log('=========Initializing L2=========');
  console.log('submissionInterval: ', initializer.submissionInterval);
  console.log('finalizedTime: ', initializer.finalizedTime);
  console.log('metadata: ', initializer.metadata);
  await initializer.initialize();
  console.log('=========L2 Initialized Done=========');
}

if (require.main === module) {
  main();
}
