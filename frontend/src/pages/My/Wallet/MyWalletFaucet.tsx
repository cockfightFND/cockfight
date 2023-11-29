import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { useMutation } from "@tanstack/react-query"
import { Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import axios from "axios"
import { useAddress } from "../../../data/account"
import { GLOBAL_PADDING, SUBMIT_MARGIN } from "../../../styles/variables"
import ErrorModalContent from "../../../components/ErrorModalContent"
import SubmitButton from "../../../components/SubmitButton"
import BackButtonBar from "../../../components/BackButtonBar"
import { FAUCET_SERVER_URL, INIT_DENOM, FAUCET_RECAPTCHA_SITEKEY } from "../../../data/constants"

const MyWalletFaucet = () => {
  const navigate = useNavigate()
  const address = useAddress()
  const [token, setToken] = useState<string | null>(null)

  const { mutate, reset } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        "/claim",
        { address, denom: INIT_DENOM, response: token },
        { baseURL: FAUCET_SERVER_URL },
      )
      return data
    },
    onSuccess: () => {
      modals.open({
        title: "Success",
        children: (
          <>
            <Text>100 INIT has been sent to your wallet</Text>
            <SubmitButton mt={SUBMIT_MARGIN} onClick={() => modals.closeAll()}>
              Ok
            </SubmitButton>
          </>
        ),
        onClose: () => {
          navigate(-1)
        },
      })
    },
    onError: (error) => {
      modals.open({
        title: "Something went wrong",
        children: <ErrorModalContent error={error} />,
        onClose: reset,
      })
    },
  })

  return (
    <>
      <BackButtonBar label="Faucet" m={-GLOBAL_PADDING} mb={0} />

      <Text c="mono.5" fz={12} fw={600} mb={20}>
        Faucet provides only 100 INIT to an account every 24 hours
      </Text>

      <ReCAPTCHA sitekey={FAUCET_RECAPTCHA_SITEKEY} onChange={setToken} />

      <SubmitButton mt={SUBMIT_MARGIN} onClick={() => mutate()}>
        Request 100 INIT
      </SubmitButton>
    </>
  )
}

export default MyWalletFaucet
