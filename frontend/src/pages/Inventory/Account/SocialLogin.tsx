import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Alert, Center, Text, Loader } from "@mantine/core"
import { requestUserInfo } from "./web3auth"
import { useManageAccount } from "../../../data/account"

const SocialLogin = () => {
  const [params] = useSearchParams()
  const provider = params.get("provider")
  if (!provider) throw new Error("Provider is not specified")

  const navigate = useNavigate()
  const { create } = useManageAccount()

  const { mutate: submit, error } = useMutation({
    mutationFn: async () => {
      const { privateKey } = await requestUserInfo(provider)
      await create({ type: "privateKey", address: "", privateKey })
    },
    onSuccess: () => navigate("/my"),
  })

  useEffect(() => {
    submit()
  }, [submit])

  if (error) {
    return (
      <Alert color="danger">
        <Text c="mono.0">{String(error)}</Text>
      </Alert>
    )
  }

  return (
    <Center h="calc(100vh - 120px)">
      <Loader color="mono.3" />
    </Center>
  )
}

export default SocialLogin
