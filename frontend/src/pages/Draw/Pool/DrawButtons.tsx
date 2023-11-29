import { useNavigate } from "react-router-dom"
import { Button, Group, Stack, Text, UnstyledButton } from "@mantine/core"
import BigNumber from "bignumber.js"
import Icon from "../../../styles/icons/Icon"
import { useBalance } from "../../../data/account"
import FixedBottom from "../../../components/FixedBottom"
import NumberButton from "./NumberButton"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"

const DrawButtons = ({ title }: { title: string }) => {
  const navigate = useNavigate()
  const balance = useBalance()
  const { pool, ticketAmount, setTicketAmount, submit } = useDrawPoolEntry()
  const { ticketPrice } = pool

  const isInsufficient = BigNumber(ticketPrice.amount).times(ticketAmount).gt(balance)

  const renderBottom = () => {
    if (isInsufficient)
      return (
        <Stack align="center" spacing={6}>
          <Text c="danger" fz={11} fw={700}>
            Not enough fund
          </Text>
          <UnstyledButton c="mono.5" fz={11} fw={600} onClick={() => navigate("/my")}>
            <Group spacing={0}>
              <Text>Deposit INIT to NFT Market</Text>
              <Icon.ChevronRight width={10} height={10} />
            </Group>
          </UnstyledButton>
        </Stack>
      )

    if (ticketAmount > 0)
      return (
        <FixedBottom>
          <Button color="brand" size="lg" fullWidth onClick={submit}>
            Click to draw
          </Button>
        </FixedBottom>
      )

    return null
  }

  return (
    <Stack spacing={28} align="center">
      <Text fz={24}>{title}</Text>

      <Group position="center">
        {[1, 10, 100].map((n) => (
          <NumberButton
            n={n}
            price={n * ticketPrice.amount}
            isActive={n === ticketAmount}
            onClick={() => setTicketAmount(n)}
            key={n}
          />
        ))}
      </Group>

      {renderBottom()}
    </Stack>
  )
}

export default DrawButtons
