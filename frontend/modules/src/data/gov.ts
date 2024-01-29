import { useQuery } from "@tanstack/react-query"
import { useMantineTheme } from "@mantine/core"
import { Proposal, Vote } from "@initia/initia.js"
import { lcd } from "../shared"

export const useGetProposalStatusItem = () => {
  const theme = useMantineTheme()

  const defaultColor = theme.colors.mono[1]
  const failedColor = theme.other.danger

  return (status: Proposal.Status) =>
    ({
      [Proposal.Status.PROPOSAL_STATUS_VOTING_PERIOD]: {
        label: "Voting",
        color: defaultColor,
      },
      [Proposal.Status.PROPOSAL_STATUS_DEPOSIT_PERIOD]: {
        label: "Deposit",
        color: defaultColor,
      },
      [Proposal.Status.PROPOSAL_STATUS_PASSED]: {
        label: "Passed",
        color: defaultColor,
      },
      [Proposal.Status.PROPOSAL_STATUS_REJECTED]: {
        label: "Rejected",
        color: failedColor,
      },
      [Proposal.Status.PROPOSAL_STATUS_UNSPECIFIED]: {
        label: "All",
        color: defaultColor,
      },
      [Proposal.Status.PROPOSAL_STATUS_FAILED]: {
        label: "Failed",
        color: failedColor,
      },
      [Proposal.Status.UNRECOGNIZED]: {
        label: "",
        color: defaultColor,
      },
    }[status])
}

export const useGetVoteOptionItem = () => {
  const theme = useMantineTheme()

  const getItem = (status: Vote.Option) => {
    // These colors are only used in the proposal vote option
    return {
      [Vote.Option.VOTE_OPTION_YES]: {
        label: "Yes",
        color: "#8597D7",
      },
      [Vote.Option.VOTE_OPTION_NO]: {
        label: "No",
        color: "#DE91A5",
      },
      [Vote.Option.VOTE_OPTION_NO_WITH_VETO]: {
        label: "No with veto",
        color: "#B53E5A",
      },
      [Vote.Option.VOTE_OPTION_ABSTAIN]: {
        label: "Abstain",
        color: theme.colors.mono[2],
      },
      [Vote.Option.VOTE_OPTION_UNSPECIFIED]: {
        label: "Did not vote",
        color: theme.colors.mono[4],
      },
      [Vote.Option.UNRECOGNIZED]: {
        label: "",
        color: "#DE91A5",
      },
    }[status]
  }

  return (param: Vote.Option | string) => {
    const option = typeof param === "string" ? Vote.Option[param as any] : param
    return getItem(option as Vote.Option)
  }
}

export const voteOptions: Vote.Option[] = [
  Vote.Option.VOTE_OPTION_YES,
  Vote.Option.VOTE_OPTION_NO,
  Vote.Option.VOTE_OPTION_NO_WITH_VETO,
  Vote.Option.VOTE_OPTION_ABSTAIN,
]

export const useGovParameters = () => {
  return useQuery({
    queryKey: ["gov.parameters"],
    queryFn: async () => await lcd.gov.parameters(),
    staleTime: Infinity,
  })
}

export const useGovTally = (id: number) => {
  return useQuery({
    queryKey: ["gov.tally", id, lcd.config],
    queryFn: async () => await lcd.gov.tally(id),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export const useGovVote = (id: number) => {
  return useQuery({
    queryKey: ["gov.votes", id, lcd.config],
    queryFn: async () => await lcd.gov.votes(id),
    refetchOnWindowFocus: false,
  })
}

export const useGovProposal = (id: number) => {
  return useQuery({ queryKey: ["gov.proposal", id], queryFn: async () => await lcd.gov.proposal(id) })
}

export const useGovProposals = (status: Proposal.Status) => {
  return useQuery({
    queryKey: ["gov.proposals", status],
    queryFn: async () => {
      const [proposals] = await lcd.gov.proposals({ proposal_status: status })
      return proposals
    },
  })
}

export const useGovDeposit = (id: number) => {
  return useQuery({
    queryKey: ["gov.deposits", id, lcd.config],
    queryFn: async () => {
      const [deposits] = await lcd.gov.deposits(id)
      return deposits
    },
  })
}
