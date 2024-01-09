// view functions for vip

import { BCS } from '@initia/initia.js'
import { config } from 'config'

export const bcs = BCS.getInstance()

interface ModuleResponse {
  agent: string
  vesting_period: string
  minimum_tvl: string
  maximum_tvl: string
  stage: string
}

interface ScoreVesting {
  reward: string
  l2_score: string
  reward_amount: string
  start_stage: string
  end_stage: string
  minimum_score: string
}

// get next stage to submit scores merkle root
export async function getNextStage(
  operator: string,
  bridgeId: string
): Promise<number> {
  const res = await config.l1lcd.move.viewFunction<string>(
    '0x1',
    'vip_reward',
    'get_next_stage',
    [],
    [bcs.serialize(BCS.ADDRESS, operator), bcs.serialize(BCS.U64, bridgeId)]
  )
  return parseInt(res)
}

export async function getOperatorCommissionRate(
  operator: string
): Promise<string> {
  const res = await config.l1lcd.move.viewFunction<string>(
    '0x1',
    'vip_reward',
    'get_operator_commission_rate',
    [],
    [bcs.serialize(BCS.ADDRESS, operator)]
  )
  return res
}

export async function getScoreVestingAtStage(
  account: string,
  bridgeId: string,
  stage: number
): Promise<ScoreVesting> {
  const res = await config.l1lcd.move.viewFunction<ScoreVesting>(
    '0x1',
    'vip_reward',
    'get_score_vesting_at_stage',
    [],
    [
      bcs.serialize(BCS.ADDRESS, account),
      bcs.serialize(BCS.U64, bridgeId),
      bcs.serialize(BCS.U64, stage),
    ]
  )
  return res
}

export async function getModuleStore(): Promise<ModuleResponse> {
  const res = await config.l1lcd.move.viewFunction<ModuleResponse>(
    '0x1',
    'vip_reward',
    'get_module_store',
    [],
    []
  )
  return res
}

export async function getStageRewardAmount(
  operator: string,
  bridgeId: string,
  stage: number
): Promise<number> {
  const res = await config.l1lcd.move.viewFunction<string>(
    '0x1',
    'vip_reward',
    'get_stage_reward',
    [],
    [
      bcs.serialize(BCS.ADDRESS, operator),
      bcs.serialize(BCS.U64, bridgeId),
      bcs.serialize(BCS.U64, stage),
    ]
  )
  return parseInt(res)
}

export async function getMinimumScore(
  account: string,
  bridgeId: string,
  stage: number
): Promise<number> {
  const res = await config.l1lcd.move.viewFunction<string>(
    '0x1',
    'vip_reward',
    'get_minimum_score',
    [],
    [
      bcs.serialize(BCS.ADDRESS, account),
      bcs.serialize(BCS.U64, bridgeId),
      bcs.serialize(BCS.U64, stage),
    ]
  )
  return parseInt(res)
}

export async function getMaxOfMinimumScore(
  account: string,
  bridgeId: string,
  stage: number
): Promise<number> {
  const res = await config.l1lcd.move.viewFunction<string>(
    '0x1',
    'vip_reward',
    'get_max_of_minimum_score',
    [],
    [
      bcs.serialize(BCS.ADDRESS, account),
      bcs.serialize(BCS.U64, bridgeId),
      bcs.serialize(BCS.U64, stage),
    ]
  )
  return parseInt(res)
}

export async function getUnlockedReward(
  account: string,
  operator: string,
  bridgeId: string,
  stage: number,
  l2Score: number
): Promise<number> {
  const res = await config.l1lcd.move.viewFunction<string>(
    '0x1',
    'vip_reward',
    'get_unlocked_reward',
    [],
    [
      bcs.serialize(BCS.ADDRESS, account),
      bcs.serialize(BCS.ADDRESS, operator),
      bcs.serialize(BCS.U64, bridgeId),
      bcs.serialize(BCS.U64, stage),
      bcs.serialize(BCS.U64, l2Score),
    ]
  )
  return parseInt(res)
}
