import React, { useState } from 'react';
import { Modal, Button, Text, Group, TextInput } from '@mantine/core';
import { MsgExecute } from '@initia/initia.proto/initia/move/v1/tx';
import BigNumber from 'bignumber.js';
import { useMutation } from '@tanstack/react-query';
import { modals } from "@mantine/modals"
import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import { aptos } from '../../../aptos/chain';
import ErrorModalContent from '../../../components/ErrorModalContent';
import { formatAmount } from '../../../utils/format';
import { transaction } from '../../../aptos/transaction';
import { CONTRACT_COCKFIGHT, CONTRACT_DEPLOYER, CONTRACT_VAULT, FUNCTION_VAULT_DEPOSIT } from '../../../aptos/cockfight';

interface FormValues {
  isBuy: boolean
  quantity: number
}

const CHICK_PRICE = 1000000;

const MarketModal = ({ onClose }: {onClose: any}) => {
  /* query */
  // const {data: market} = useAPI<{
  //   markets: {
  //     time: string
  //     stage: number
  //     totalChickenNum: number
  //     totalEggNum: number
  //     chickenPrice: number
  //     eggPrice: number
  //   }[] 
  // }>('/market', {limit:1})


  /* state */
  const [isVolatile, setIsVolatile] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);


  /* context */
  const { account, signAndSubmitTransaction } = useWallet();
  // const useBalance = async () => {
  //   if (account) {
  //     const amount = await aptos.getAccountAPTAmount({
  //       accountAddress: account!.address,
  //     });
  //     setBalance(amount);
  //     setIsLoaded(true);
  //   } else {
  //     setBalance(0);
  //   }
  // };


  /* submit */
  const { mutate, data, isLoading, isIdle, reset } = useMutation({
    mutationFn: async ({isBuy, quantity}: FormValues) => {
      if (!account) throw new Error("Wallet not connected")
      setTransactionInProgress(true);
      
      const transaction: InputTransactionData = {
        data: {
          function: `${CONTRACT_DEPLOYER}::${CONTRACT_VAULT}::${FUNCTION_VAULT_DEPOSIT}`,
          functionArguments: ['100']
        }
      }
      try {
        const response = await signAndSubmitTransaction(transaction);
        await aptos.waitForTransaction({ transactionHash: response.transactionHash });
      } catch (err) {
        console.log(err)
      } finally {
        setTransactionInProgress(false);
      }
    },
    onSuccess: (data) => {
      modals.open({
        title: "Success",
        children: <Text>Transaction has been sent</Text>,
        onClose: reset,
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

  const onClickBuyButton = async () => {
    mutate({isBuy: true, quantity});
    onClose();
  };

  const onClickSellButton = () => {
    mutate({isBuy: false, quantity});
    onClose();
  };

  return (
    <Modal
      opened={true}
      onClose={() => onClose(false)}
      title="Chicken Details"
      centered
      styles={(theme) => ({
        modal: {
          width: '90%', // Sets the width relative to the parent
          maxWidth: '400px', // Ensures the modal is not too wide on larger screens
        },
        title: {
          fontSize: '24px',
          fontWeight: 600,
          textAlign: 'center',
          color: theme.colors.blue[6],
        },
        body: {
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.md,
        },
      })}
    >
      <Text size="md" style={{ marginBottom: '20px', fontWeight: 500 }}>Would you buy this one?</Text>
      
      <Text size="sm" style={{ marginBottom: '10px' }}>Buy Price: 0.01 APT </Text>
      <Text size="sm" style={{ marginBottom: '10px' }}>Sell Price: 0.01 APT</Text>
      <Text size="sm" style={{ marginBottom: '20px' }}>Egg Production: 2 eggs</Text>

      <TextInput
        label="Quantity"
        value={quantity.toString()}
        onChange={(event) => setQuantity(parseInt(event.currentTarget.value))}
        type="number"
        min="1"
        style={{
          marginTop: '20px', 
          marginBottom: '20px', 
          borderColor: '#cbd5e1',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', 
          borderRadius: '8px',
        }}
      />

      <Group position="center" spacing="md">
        <Button color="green" onClick={() => onClickBuyButton()}>Buy</Button>
        <Button color="red" onClick={() => onClickSellButton()}>Sell</Button>
      </Group>
    </Modal>
  );
};

export default MarketModal;