import { Link } from "react-router-dom";
import { CopyButton, Group, Stack, Text, UnstyledButton } from "@mantine/core";
// import { formatAmount, truncate } from "../../utils/format"
import { useAddress, useBalance } from "../../data/account";
import Icon from "../../styles/icons/Icon";
import { formatAmount, truncate } from "../../utils/format";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

import { useEffect, useState } from "react";

import { Aptos, AptosConfig, ClientConfig, Network } from "@aptos-labs/ts-sdk";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

const MyIndexBalance = () => {
  const address = useAddress();
  const balance = useBalance();
  const chain = 1;

  if (chain == 0) {
    return (
      <Stack spacing={36} bg="mono.8" c="mono.1" sx={{ border: "1px solid", borderRadius: 16 }} mt={16} px={18} py={24}>
        <Group position="apart">
          <Text fz={14}>{address ? "Wallet" : "Wallet not connected"}</Text>
          <CopyButton value={address}>
            {({ copy }) => (
              <UnstyledButton onClick={copy} c="mono.2" bg="mono.7" px={10} sx={{ borderRadius: 24 / 2, height: 24 }}>
                <Group spacing={8}>
                  <Text fz={12} fw={600}>
                    {truncate(address)}
                  </Text>
                  <Icon.Copy width={12} height={12} />
                </Group>
              </UnstyledButton>
            )}
          </CopyButton>
        </Group>

        <Link to="./wallet/settings">
          <Group position="right" spacing={3} c="mono.6">
            <Text c="mono.1" fz={30}>
              {formatAmount(balance)} INIT
            </Text>
            <Icon.ChevronRight width={24} height={24} />
          </Group>
        </Link>
      </Stack>
    );
  } else if (chain == 1) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [balance2, setBalance2] = useState(0);
    const clientConfig: ClientConfig = {
      API_KEY: process.env.REACT_APP_APIKEY,
    };

    const config = new AptosConfig({
      fullnode: "fullnode.random.aptoslabs.com",
      network: Network.RANDOMNET,
      clientConfig,
    });

    const { account } = useWallet();
    const useBalance2 = async () => {
      if (account) {
        const amount = await aptos.getAccountAPTAmount({
          accountAddress: account!.address,
        });
        setBalance2(amount);
        setIsLoaded(true);
      } else {
        setBalance2(0);
      }
    };

    const aptos = new Aptos(config);

    useEffect(() => {
      useBalance2();
    }, [account]);

    return (
      <Stack spacing={36} bg="mono.8" c="mono.1" sx={{ border: "1px solid", borderRadius: 16 }} mt={16} px={18} py={24}>
        <Group position="apart">
          <Text fz={14}>{address ? "Wallet" : "Wallet not connected"}</Text>
          <WalletSelector />
          <CopyButton value={address}>
            {({ copy }) => (
              <UnstyledButton onClick={copy} c="mono.2" bg="mono.7" px={10} sx={{ borderRadius: 24 / 2, height: 24 }}>
                <Group spacing={8}>
                  <Text fz={12} fw={600}>
                    {truncate(account?.address)}
                  </Text>
                  <Icon.Copy width={12} height={12} />
                </Group>
              </UnstyledButton>
            )}
          </CopyButton>
        </Group>

        <Link to="./wallet/settings">
          <Group position="right" spacing={3} c="mono.6">
            {isLoaded && (
              <Text c="mono.1" fz={30}>
                {formatAmount(balance2, 8)} APT
              </Text>
            )}
            <Icon.ChevronRight width={24} height={24} />
          </Group>
        </Link>
      </Stack>
    );
  }
};

export default MyIndexBalance;
