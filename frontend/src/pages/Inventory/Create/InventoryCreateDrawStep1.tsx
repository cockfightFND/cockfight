import { useNavigate } from "react-router-dom"
import { useForm, useFormContext } from "react-hook-form"
import { TextInput } from "@mantine/core"
import FixedBottom from "../../../components/FixedBottom"
import SubmitButton from "../../../components/SubmitButton"
import type { FormValues } from "./InventoryCreateDraw"
import useCreateState from "./useCreateState"
import InventoryCreateDrawStepComponent from "./InventoryCreateDrawStepComponent"

const InventoryCreateDrawStep1 = () => {
  const navigate = useNavigate()
  const state = useCreateState()

  const { setValue, getValues } = useFormContext<FormValues>()
  const { register, handleSubmit, formState } = useForm<{ title: string }>({
    defaultValues: { title: getValues("title") ?? "" },
  })

  const submit = handleSubmit(({ title }) => {
    setValue("title", title)
    navigate("./2", { state, replace: true })
  })

  const getErrorMessage = () => {
    switch (formState.errors.title?.type) {
      case "required":
        return "Title is required"

      case "pattern":
        return "Only alphabets, spaces and dashes are allowed"

      default:
        return formState.errors.title?.type
    }
  }

  return (
    <form onSubmit={submit}>
      <InventoryCreateDrawStepComponent
        step={1}
        title="Enter the title of this draw"
        back={`../game/${state.collectionAddress}`}
      >
        <TextInput
          {...register("title", { required: true, pattern: /^[a-zA-Z\s-]+$/i })}
          placeholder="Draw Title"
          size="xl"
          error={getErrorMessage()}
        />

        <FixedBottom>
          <SubmitButton>That's cool</SubmitButton>
        </FixedBottom>
      </InventoryCreateDrawStepComponent>
    </form>
  )
}

export default InventoryCreateDrawStep1
