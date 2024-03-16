import type { PropsWithChildren } from "react"
import { Box, Group, Text } from "@mantine/core"
import type BigNumber from "bignumber.js"
import { formatAmount } from "../../utils/format"
import Icon from "../styles/icons/Icon"
import { SUBMIT_MARGIN } from "../styles/variables"
import SubmitButton from "./SubmitButton"

interface Props {
  onClick: () => void
  buttonLabel?: string
  amount?: BigNumber.Value
}

const TxSuccess = ({ children, onClick, buttonLabel = "Ok", amount }: PropsWithChildren<Props>) => (
  <Box ta="center">
    <Text c="mono.9">
      <Icon.CheckCircleFilled width={50} height={50} />
    </Text>

    {amount && (
      <Text fz={24} fw={800} mt={12}>
        <Text span>{formatAmount(amount)}</Text>{" "}
        <Text fz={16} span>
          INIT
        </Text>
      </Text>
    )}

    <Text c="mono.5" fz={14} fw={700} mt={8}>
      {children}
    </Text>

    <Group mt={SUBMIT_MARGIN}>
      <SubmitButton onClick={onClick}>{buttonLabel}</SubmitButton>
    </Group>
  </Box>
)

export default TxSuccess
