import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Stack, Text, Title, UnstyledButton } from "@mantine/core"
import FixedBottom from "../../../components/FixedBottom"

const CreateAccount = () => {
  const navigate = useNavigate()

  return (
    <>
      <FixedBottom>
        <Stack spacing={8}>
          {[{ label: "Google" }, { label: "Twitter" }, { label: "Facebook" }].map(({ label }) => (
            <Button
              variant="outline"
              onClick={() => navigate(`/my/account/social?provider=${label.toLowerCase()}`)}
              sx={({ fn }) => ({
                background: "white",
                border: `2px solid ${fn.themeColor("mono.9")}`,
                borderRadius: 52 / 2,
                borderWidth: 2,
                color: fn.themeColor("mono.9"),
                fontSize: 14,
                fontWeight: 800,
                height: 52,

                ...fn.hover({ background: "white" }),
              })}
              key={label}
            >
              <Text>{label}</Text>
            </Button>
          ))}

          <UnstyledButton component={Link} to="/my/account/create/mnemonic">
            <Text c="mono.5" fz={12} fw={600} ta="center">
              Import with seed phrase
            </Text>
          </UnstyledButton>
        </Stack>
      </FixedBottom>
    </>
  )
}

export default CreateAccount
