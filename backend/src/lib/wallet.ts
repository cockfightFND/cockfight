import {
  Key,
  Wallet,
  Msg,
  TxInfo,
  MnemonicKey,
  LCDClient,
  WaitTxBroadcastResult
} from '@initia/initia.js';
import { sendTx } from './tx';
import { getConfig } from 'config';

const config = getConfig();

export enum WalletType {
  Challenger = 'challenger',
  Executor = 'executor',
  BatchSubmitter = 'batchSubmitter',
  OutputSubmitter = 'outputSubmitter'
}

export const wallets: {
  challenger: TxWallet | undefined;
  executor: TxWallet | undefined;
  batchSubmitter: TxWallet | undefined;
  outputSubmitter: TxWallet | undefined;
} = {
  challenger: undefined,
  executor: undefined,
  batchSubmitter: undefined,
  outputSubmitter: undefined
};

export function initWallet(type: WalletType, lcd: LCDClient): void {
  switch (type) {
    case WalletType.Challenger:
      wallets[type] = new TxWallet(
        lcd,
        new MnemonicKey({ mnemonic: config.CHALLENGER_MNEMONIC })
      );
      break;
    case WalletType.Executor:
      wallets[type] = new TxWallet(
        lcd,
        new MnemonicKey({ mnemonic: config.EXECUTOR_MNEMONIC })
      );
      break;
    case WalletType.BatchSubmitter:
      wallets[type] = new TxWallet(
        lcd,
        new MnemonicKey({ mnemonic: config.BATCH_SUBMITTER_MNEMONIC })
      );
      break;
    case WalletType.OutputSubmitter:
      wallets[type] = new TxWallet(
        lcd,
        new MnemonicKey({ mnemonic: config.OUTPUT_SUBMITTER_MNEMONIC })
      );
      break;
  }
}

// Access the wallets
export function getWallet(type: WalletType): TxWallet {
  if (!wallets[type]) {
    throw new Error(`Wallet ${type} not initialized`);
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return wallets[type]!;
}

export class TxWallet extends Wallet {
  private managedAccountNumber;
  private managedSequence;

  constructor(lcd: LCDClient, key: Key) {
    super(lcd, key);
  }

  async transaction(msgs: Msg[]): Promise<WaitTxBroadcastResult> {
    if (!this.managedAccountNumber && !this.managedSequence) {
      const { account_number: accountNumber, sequence } =
        await this.accountNumberAndSequence();
      this.managedAccountNumber = accountNumber;
      this.managedSequence = sequence;
    }

    try {
      const txInfo = await sendTx(
        this,
        msgs,
        this.managedAccountNumber,
        this.managedSequence
      );
      this.managedSequence += 1;
      return txInfo;
    } catch (err) {
      delete this.managedAccountNumber;
      delete this.managedSequence;
      throw err;
    }
  }
}
