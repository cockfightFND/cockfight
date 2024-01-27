import { LCDClient } from '@initia/initia.js'
import dotenv from 'dotenv'

dotenv.config()

const {
  SERVER_PORT,
  L1_LCD_URI,
  L1_RPC_URI,
  OPERATOR_MNEMONIC,
  PRIZE_AMOUNT,
  USE_LOG_FILE,
} = process.env

export const config = {
  SERVER_PORT: SERVER_PORT ? parseInt(SERVER_PORT) : 6000,
  L1_LCD_URI: L1_LCD_URI ? L1_LCD_URI.split(',') : ['http://localhost:1317'],
  L1_RPC_URI: L1_RPC_URI ? L1_RPC_URI.split(',') : ['http://localhost:26657'],
  OPERATOR_MNEMONIC: OPERATOR_MNEMONIC || '',
  PRIZE_AMOUNT: PRIZE_AMOUNT ? Number.parseInt(PRIZE_AMOUNT) : 100_000_000,
  l1lcd: new LCDClient(
    L1_LCD_URI ? L1_LCD_URI.split(',')[0] : 'http://localhost:1317',
    {
      gasPrices: '0.15uinit',
      gasAdjustment: '100000',
    }
  ),
  USE_LOG_FILE: USE_LOG_FILE === 'true' ? true : false,
}