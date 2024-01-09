import { BCS, LCDClient } from '@initia/initia.js'
import axios from 'axios'
import { delay } from 'bluebird'

export const bcs = BCS.getInstance()

export const checkHealth = async (url: string, timeout = 60_000) => {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios.get(url)
      if (response.status === 200) return response
    } catch {
      continue
    }
    await new Promise((res) => setTimeout(res, 1_000))
  }
}

export async function getLastProposalId(lcd: LCDClient): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [proposals, pagination] = await lcd.gov.proposals()
  if (proposals.length === 0) return 0
  return proposals[proposals.length - 1].id
}

export async function getProposalStatus(
  lcd: LCDClient,
  proposalId: number
): Promise<ProposalStatus | null> {
  const proposal = await lcd.gov.proposal(proposalId)
  return proposal ? proposal.status : null
}

export async function checkProposalPassed(
  lcd: LCDClient,
  proposalId: number
): Promise<void> {
  for (;;) {
    console.log(`checking proposal ${proposalId} status... in ${lcd.URL}`)
    const status = await getProposalStatus(lcd, proposalId)
    if (status === ProposalStatus.PROPOSAL_STATUS_PASSED) return
    if (status === ProposalStatus.PROPOSAL_STATUS_REJECTED)
      throw new Error(`proposal ${proposalId} rejected`)
    if (status === ProposalStatus.PROPOSAL_STATUS_FAILED)
      throw new Error(`proposal ${proposalId} failed`)
    await delay(5_000)
  }
}

enum ProposalStatus {
  PROPOSAL_STATUS_UNSPECIFIED = 0,
  PROPOSAL_STATUS_DEPOSIT_PERIOD = 1,
  PROPOSAL_STATUS_VOTING_PERIOD = 2,
  PROPOSAL_STATUS_PASSED = 3,
  PROPOSAL_STATUS_REJECTED = 4,
  PROPOSAL_STATUS_FAILED = 5,
  UNRECOGNIZED = -1,
}

export interface ClaimData {
  operator: string
  bridgeId: number
  stage: number
  merkleProofs: string[]
  l2Score: number
}

export interface ZappingData {
  operator: string
  bridgeId: number
  lpMetadata: string
  minLiquidity: number | null
  validator: string
  stage: number
  zappingAmount: number
  stakelistedAmount: number
  stakelistedMetadata: string
}

export interface ZappingClaimData {
  receiver: string
  validator: string
  releaseTime: number
  index: number
}
