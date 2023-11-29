import { LCDClient } from '@initia/initia.js';

interface ConfigInterface {
  EXECUTOR_PORT: number;
  L1_LCD_URI: string;
  L1_RPC_URI: string;
  L2_LCD_URI: string;
  L2_RPC_URI: string;
  L1_DENOM: string;
  BRIDGE_ID: number;
  EXECUTOR_MNEMONIC: string;
  EXECUTOR_ADDR: string;
  USE_LOG_FILE: boolean;
  l1lcd: LCDClient;
  l2lcd: LCDClient;
  EXCLUDED_ROUTES: string[];
}

const defaultConfig = {
  EXECUTOR_PORT: '3000',
  L1_LCD_URI: 'https://stone-rest.initia.tech',
  L1_RPC_URI: 'https://stone-rpc.initia.tech',
  L2_LCD_URI: 'https://minitia-rest.initia.tech',
  L2_RPC_URI: 'https://minitia-rpc.initia.tech',
  EXECUTOR_URI: 'https://minitia-executor.initia.tech',
  L1_DENOM: 'uinit',
  BRIDGE_ID: '',
  EXECUTOR_ADDR: '',
  EXECUTOR_MNEMONIC: '',
  USE_LOG_FILE: 'false'
};

export class Config implements ConfigInterface {
  private static instance: Config;

  EXECUTOR_PORT: number;
  BATCH_PORT: number;
  L1_LCD_URI: string;
  L1_RPC_URI: string;
  L2_LCD_URI: string;
  L2_RPC_URI: string;
  EXECUTOR_URI: string;
  L1_DENOM: string;
  BRIDGE_ID: number;
  OUTPUT_SUBMITTER_MNEMONIC: string;
  EXECUTOR_ADDR: string;
  EXECUTOR_MNEMONIC: string;
  BATCH_SUBMITTER_MNEMONIC: string;
  CHALLENGER_MNEMONIC: string;
  USE_LOG_FILE: boolean;
  l1lcd: LCDClient;
  l2lcd: LCDClient;
  EXCLUDED_ROUTES: string[] = [];

  private constructor() {
    const {
      EXECUTOR_PORT,
      L1_LCD_URI,
      L1_RPC_URI,
      L2_LCD_URI,
      L2_RPC_URI,
      EXECUTOR_URI,
      L1_DENOM,
      BRIDGE_ID,
      EXECUTOR_ADDR,
      EXECUTOR_MNEMONIC,
      USE_LOG_FILE
    } = { ...defaultConfig, ...process.env };

    this.EXECUTOR_PORT = parseInt(EXECUTOR_PORT);
    this.L1_LCD_URI = L1_LCD_URI;
    this.L1_RPC_URI = L1_RPC_URI;
    this.L2_LCD_URI = L2_LCD_URI;
    this.L2_RPC_URI = L2_RPC_URI;
    this.EXECUTOR_URI = EXECUTOR_URI;
    this.L1_DENOM = L1_DENOM;
    this.BRIDGE_ID = parseInt(BRIDGE_ID);
    this.EXECUTOR_ADDR = EXECUTOR_ADDR;
    this.EXECUTOR_MNEMONIC = EXECUTOR_MNEMONIC;
    this.USE_LOG_FILE = !!JSON.parse(USE_LOG_FILE);
    this.l1lcd = new LCDClient(L1_LCD_URI, {
      gasPrices: '0.15uinit',
      gasAdjustment: '2'
    });
    this.l2lcd = new LCDClient(L2_LCD_URI, {
      gasPrices: '0.15umin',
      gasAdjustment: '2'
    });
  }

  public static getConfig(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public static updateConfig(newConfig: Partial<ConfigInterface>) {
    Config.instance = { ...Config.instance, ...newConfig };
  }
}

export function getConfig() {
  return Config.getConfig();
}

const config = Config.getConfig();
export default config;

export const INTERVAL_BATCH = 10000;
export const INTERVAL_MONITOR = 100;
export const INTERVAL_OUTPUT = 10000;
