import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useMutation } from "@tanstack/react-query";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import axios from "axios";
import { useAddress } from "../../data/account";
import { GLOBAL_PADDING, SUBMIT_MARGIN } from "../../styles/variables";
import ErrorModalContent from "../../components/ErrorModalContent";
import SubmitButton from "../../components/SubmitButton";
import BackButtonBar from "../../components/BackButtonBar";
import { INIT_DENOM, API_URL } from "../../data/constants";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const MyWalletFaucet = () => {
  const chain = 1;
  const navigate = useNavigate();

  if (chain == 0) {
    const address = useAddress();
    const [token, setToken] = useState<string | null>(null);

    const { mutate, reset } = useMutation({
      mutationFn: async () => {
        const { data } = await axios.post(
          "/claim",
          { address, denom: INIT_DENOM, response: token },
          { baseURL: API_URL },
        );
        return data;
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
            navigate(-1);
          },
        });
      },
      onError: error => {
        modals.open({
          title: "Something went wrong",
          children: <ErrorModalContent error={error} />,
          onClose: reset,
        });
      },
    });

    return (
      <>
        <BackButtonBar label="Faucet" m={-GLOBAL_PADDING} mb={0} />

        <Text c="mono.5" fz={12} fw={600} mb={20}>
          Faucet provides only 100 INIT to an account every 24 hours
        </Text>
        <SubmitButton mt={SUBMIT_MARGIN} onClick={() => mutate()}>
          Request 100 INIT
        </SubmitButton>
      </>
    );
  } else if (chain == 1) {
    const { account } = useWallet();
    const mutate = async () => {
      const aptosFaucetUrl = `https://faucet.random.aptoslabs.com/mint`;
      const res = await axios.post(aptosFaucetUrl, null, {
        params: {
          amount: 1000000,
          address: account?.address,
        },
      });
      navigate(-1);
    };

    return (
      <>
        <BackButtonBar label="Faucet" m={-GLOBAL_PADDING} mb={0} />

        <SubmitButton mt={SUBMIT_MARGIN} onClick={() => mutate()}>
          Request 0.01 APT
        </SubmitButton>
      </>
    );
  }
};

export default MyWalletFaucet;
