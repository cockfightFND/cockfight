import React, { useState } from 'react';
import { Modal, Button, Text, Group, TextInput } from '@mantine/core';
import { CONTRACT_BECH_ADDRESS, CONTRACT_MODULE_NAME } from '../../data/constants';
import { computeCoinMetadata, normalize } from '../../utils/metadata';
import { useAddress, useBalance, useSignAndBroadcastTxSync } from '../../data/account';
import { MsgExecute } from '@initia/initia.proto/initia/move/v1/tx';
import { bcs } from "@initia/query"
import ErrorModalContent from '../../components/ErrorModalContent';
import BigNumber from 'bignumber.js';
import { useMutation } from '@tanstack/react-query';
import { modals } from "@mantine/modals"
import { useGetModuleStore } from '../../data/query';
import { useAPI } from '../../data/api';
import { formatAmount } from '@initia/utils';

interface FormValues {
  isBuy: boolean
  quantity: number
}

const MarketModal = ({ onClose }: {onClose: any}) => {
  /* query */
  const {data: moduleResponse} = useGetModuleStore()
  const {data: market} = useAPI<{
    markets: {
      time: string
      stage: number
      totalChickenNum: number
      totalEggNum: number
      chickenPrice: number
      eggPrice: number
    }[] 
  }>('/market', {limit:1})


  /* state */
  const [isVolatile, setIsVolatile] = useState(false);
  const [quantity, setQuantity] = useState(1);


  /* context */
  const address = useAddress()
  const balance = useBalance()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()


  /* submit */
  const { mutate, data, isLoading, isIdle, reset } = useMutation({
    mutationFn: async ({isBuy, quantity}: FormValues) => {
      if (!address) throw new Error("Wallet not connected")
      if (!moduleResponse?.chicken_price) throw new Error("Chicken price not found")
      if (BigNumber(moduleResponse.chicken_price).gt(balance)) throw new Error("Insufficient balance")

      const msgs = []
      if (isBuy){
        const message = {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: CONTRACT_BECH_ADDRESS,
            moduleName: CONTRACT_MODULE_NAME,
            functionName: "buy_chicken_script",
            typeArgs: [],
            args: [
              bcs.ser("u64", quantity).toBytes()
            ],
          }),
        }
        msgs.push(message)
      } else {
        const message = {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: CONTRACT_BECH_ADDRESS,
            moduleName: CONTRACT_MODULE_NAME,
            functionName: "sell_chicken_script",
            typeArgs: [],
            args: [
              bcs.ser("u64", quantity).toBytes()
            ],
          }),
        }
        msgs.push(message) 
      }
      
      return await signAndBroadcastTxSync(msgs)
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
      
      <Text size="sm" style={{ marginBottom: '10px' }}>Buy Price: {formatAmount(market?.markets? market.markets[0].chickenPrice : 0)} INIT</Text>
      <Text size="sm" style={{ marginBottom: '10px' }}>Sell Price: {formatAmount(market?.markets? market.markets[0].chickenPrice : 0)} INIT</Text>
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