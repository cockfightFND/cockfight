import { Outlet } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { useHideNavigation } from "../../../app/hooks"
import useCreateState from "./useCreateState"

export interface FormValues {
  title: string
  collectionAddress: string
  tokenAddresses: string[]
  price: string
  sweepAmount: number
}

const InventoryCreateDraw = () => {
  useHideNavigation()
  const state = useCreateState()
  const methods = useForm<FormValues>({ defaultValues: { ...state, title: "", price: "1", sweepAmount: 0 } })

  return (
    <FormProvider {...methods}>
      <Outlet />
    </FormProvider>
  )
}

export default InventoryCreateDraw
