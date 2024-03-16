import { Link } from "react-router-dom"
import { UnstyledButton } from "@mantine/core"
import { useAddress } from "../../data/account"
import { GLOBAL_PADDING } from "../../styles/variables"
import Icon from "../../styles/icons/Icon"
import BackButtonBar from "../../components/BackButtonBar"
import Caution from "../../components/Caution"
import { truncate } from "../../utils/format"

const MyWallet = () => {
  const address = useAddress()

  return (
    <>
      <BackButtonBar
        label={truncate(address)}
        actions={
          <UnstyledButton display="flex" component={Link} to="./settings" p={GLOBAL_PADDING}>
            <Icon.Settings />
          </UnstyledButton>
        }
        m={-GLOBAL_PADDING}
        mb={0}
      />

      <Caution />
    </>
  )
}

export default MyWallet
