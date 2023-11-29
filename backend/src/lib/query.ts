import { BridgeInfo, OutputInfo } from '@initia/initia.js';
import { getConfig } from 'config';
import {
  DepositTxResponse,
  OutputResponse,
  WithdrawalTxResponse
} from './types';
import axios from 'axios';

const config = getConfig();

/// LCD query

// get the latest output from L1 chain
export async function getLastOutputInfo(
  bridgeId: number
): Promise<OutputInfo | null> {
  const [outputInfos, pagination] = await config.l1lcd.ophost.outputInfos(bridgeId);
  if (outputInfos.length === 0) return null;
  return await config.l1lcd.ophost.outputInfo(bridgeId, pagination.total);
}

// get the output by index from L1 chain
export async function getOutputInfoByIndex(
  bridgeId: number,
  outputIndex: number
): Promise<OutputInfo> {
  return await config.l1lcd.ophost.outputInfo(bridgeId, outputIndex);
}

export async function getBridgeInfo(bridgeId: number): Promise<BridgeInfo> {
  return await config.l1lcd.ophost.bridgeInfo(bridgeId);
}

/// API query

export async function getWithdrawalTxFromExecutor(
  bridge_id: number,
  sequence: number
): Promise<WithdrawalTxResponse> {
  const url = `${config.EXECUTOR_URI}/tx/withdrawal/${bridge_id}/${sequence}`;

  const res = await axios.get(url);
  return res.data;
}

export async function getDepositTxFromExecutor(
  bridge_id: number,
  sequence: number
): Promise<DepositTxResponse> {
  const url = `${config.EXECUTOR_URI}/tx/deposit/${bridge_id}/${sequence}`;
  const res = await axios.get(url);
  return res.data;
}

// fetching the output by index from l2 chain
export async function getOutputFromExecutor(
  outputIndex: number
): Promise<OutputResponse> {
  const url = `${config.EXECUTOR_URI}/output/${outputIndex}`;
  const res = await axios.get(url);
  return res.data;
}

// fetching the latest output from l2 chain
export async function getLatestOutputFromExecutor(): Promise<OutputResponse> {
  const url = `${config.EXECUTOR_URI}/output/latest`;
  const res = await axios.get(url);
  return res.data;
}

export const checkHealth = async (url: string, timeout = 60_000) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) return;
    } catch {
      continue;
    }
    await new Promise((res) => setTimeout(res, 1_000));
  }
};
