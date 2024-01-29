import React from 'react';
import { Modal, Button, Text, Group } from '@mantine/core';
import { CONTRACT_BECH_ADDRESS, CONTRACT_MODULE_NAME } from '../../data/constants';
import { computeCoinMetadata, normalize } from '../../utils/metadata';
import { useAddress, useBalance, useSignAndBroadcastTxSync } from '../../data/account';
import { MsgExecute } from '@initia/initia.proto/initia/move/v1/tx';
import { bcs } from "@initia/query"
import ErrorModalContent from '../../components/ErrorModalContent';
import BigNumber from 'bignumber.js';
import { useMutation } from '@tanstack/react-query';
import { modals } from "@mantine/modals"
import { useViewFunction } from '../../../modules';
import { useGetChickenPrice } from '../../data/query';

const MarketModal = ({ onClose }: {onClose: any}) => {
  /* query */
  const {data: chickPrice} = useGetChickenPrice()
  
  /* state */
  const [isVolatile, setIsVolatile] = React.useState(false);
  
  /* context */
  const address = useAddress()
  const balance = useBalance()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()


  /* submit */
  const { mutate, data, isLoading, isIdle, reset } = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected")
      if (!chickPrice) throw new Error("Chicken price not found")
      if (BigNumber(chickPrice).gt(balance)) throw new Error("Insufficient balance")

      const message = {
        typeUrl: "/initia.move.v1.MsgExecute",
        value: MsgExecute.fromPartial({
          sender: address,
          moduleAddress: CONTRACT_BECH_ADDRESS,
          moduleName: CONTRACT_MODULE_NAME,
          functionName: "buy_chicken_script",
          typeArgs: [],
          args: [
            bcs.ser("u64", 1).toBytes()
          ],
        }),
      }
      return await signAndBroadcastTxSync([message])
    },
    onSuccess: (data) => {
      modals.open({
        title: "Success",
        // children: <Text>Transaction has been sent</Text>,
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

  const onClickYesButton = async () => {
    mutate();
    onClose();
  };

  const onClickNoButton = () => {
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
      
      <Text size="sm" style={{ marginBottom: '10px' }}>Buy Price: 1 INIT</Text>
      <Text size="sm" style={{ marginBottom: '10px' }}>Sell Price: 1 INIT</Text>
      <Text size="sm" style={{ marginBottom: '20px' }}>Egg Production: 2 eggs</Text>

      <Group position="center" spacing="md">
        <Button color="green" onClick={() => onClickYesButton()}>Yes</Button>
        <Button color="red" onClick={() => onClickNoButton()}>No</Button>
      </Group>
    </Modal>
  );
};

export default MarketModal;