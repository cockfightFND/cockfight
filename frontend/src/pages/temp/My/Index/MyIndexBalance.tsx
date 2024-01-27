import { Link } from "react-router-dom"
import { CopyButton, Group, Stack, Text, UnstyledButton } from "@mantine/core"
import { formatAmount, truncate } from "@initia/utils"
import { useAddress, useBalance } from "../../../data/account"
import Icon from "../../../styles/icons/Icon"

const MyIndexBalance = () => {
  const address = useAddress()
  const balance = useBalance()

  return (
    <Stack spacing={36} bg="mono.8" c="mono.1" sx={{ border: "1px solid", borderRadius: 16 }} mt={16} px={18} py={24}>
      <Group position="apart">
        <Text fz={14}>{address ? "Wallet" : "Wallet not connected"}</Text>
        <CopyButton value={address}>
          {({ copy }) => (
            <UnstyledButton onClick={copy} c="mono.2" bg="mono.7" px={10} sx={{ borderRadius: 24 / 2, height: 24 }}>
              <Group spacing={8}>
                <Text fz={12} fw={600}>
                  {truncate(address)}
                </Text>
                <Icon.Copy width={12} height={12} />
              </Group>
            </UnstyledButton>
          )}
        </CopyButton>
      </Group>

      <Link to="./wallet/settings">
        <Group position="right" spacing={3} c="mono.6">
          <Text c="mono.1" fz={30}>
            828682.673 USDT
            {/* {formatAmount(balance)} USDT */}
          </Text>
          <Icon.ChevronRight width={24} height={24} />
        </Group>
      </Link>
    </Stack>
  )
}

export default MyIndexBalance
