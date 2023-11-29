import { Link } from "react-router-dom"
import { Group, Text, UnstyledButton } from "@mantine/core"
import { GLOBAL_PADDING } from "../../../styles/variables"
import Icon from "../../../styles/icons/Icon"
import BackButtonBar from "../../../components/BackButtonBar"

const menu = [
  { label: "Accounts", to: "/my/account/manage" },
  { label: "Get INIT", to: "/faucet" },
]

const MyWalletSettings = () => {
  return (
    <>
      <BackButtonBar label="Settings" m={-GLOBAL_PADDING} mb={0} />

      {menu.map(({ label, to }) => (
        <UnstyledButton display="block" component={Link} to={to} py={16} key={to}>
          <Group position="apart">
            <Text fw={800}>{label}</Text>
            <Text c="mono.5">
              <Icon.ChevronRight />
            </Text>
          </Group>
        </UnstyledButton>
      ))}
    </>
  )
}

export default MyWalletSettings
