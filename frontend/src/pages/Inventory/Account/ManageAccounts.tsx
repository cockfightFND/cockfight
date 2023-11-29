import { useNavigate } from "react-router-dom"
import { Button, Group, Stack, Text } from "@mantine/core"
import { truncate } from "@initia/utils"
import { useManageAccount } from "../../../data/account"
import { GLOBAL_PADDING } from "../../../styles/variables"
import BackButtonBar from "../../../components/BackButtonBar"

const ManageAccounts = () => {
  const navigate = useNavigate()
  const { accounts, remove } = useManageAccount()

  return (
    <>
      <BackButtonBar label="Account" m={-GLOBAL_PADDING} mb={0} />

      <Stack spacing={8} mt={20}>
        {accounts.map(({ address }) => {
          const handleRemove = () => {
            if (!window.confirm("Are you sure?")) return
            remove(address)
            navigate("/")
          }

          return (
            <Group position="apart" bg="mono.1" px={16} py={20} sx={{ borderRadius: 12 }} key={address}>
              <Text>{truncate(address)}</Text>
              <Button color="red" size="xs" onClick={handleRemove}>
                Delete
              </Button>
            </Group>
          )
        })}
      </Stack>
    </>
  )
}

export default ManageAccounts
