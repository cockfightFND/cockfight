import { Stack, Text, Textarea } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useManageAccount } from "../../../data/account"
import SubmitButton from "../../../components/SubmitButton"
import Caution from "../../../components/Caution"

const CreateAccountMnemonicForm = () => {
  const navigate = useNavigate()
  const { create } = useManageAccount()
  const { register, handleSubmit, formState } = useForm<{ mnemonic: string }>({ defaultValues: { mnemonic: "" } })

  const submit = handleSubmit(async ({ mnemonic }) => {
    await create({ type: "mnemonic", address: "", mnemonic, index: 0 })
    navigate(-1)
  })

  return (
    <form onSubmit={submit}>
      <Stack>
        <Text>Import with seed phrase</Text>
        <Caution>Not secure yet. Never enter your personal mnemonic here.</Caution>
        <Textarea {...register("mnemonic")} error={formState.errors.mnemonic?.message} autosize minRows={4} />
        <SubmitButton>Create</SubmitButton>
      </Stack>
    </form>
  )
}

export default CreateAccountMnemonicForm
