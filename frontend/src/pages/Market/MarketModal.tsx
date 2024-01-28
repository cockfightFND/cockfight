import React from 'react';
import { Modal, Button, Text, Group } from '@mantine/core';

const MarketModal = ({ onClose }: {onClose: any}) => {
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
      
      <Text size="sm" style={{ marginBottom: '10px' }}>Buy Price: 1000USDT</Text>
      <Text size="sm" style={{ marginBottom: '10px' }}>Sell Price: 1000USDT</Text>
      <Text size="sm" style={{ marginBottom: '20px' }}>Egg Production: 1000 eggs</Text>

      <Group position="center" spacing="md">
        <Button color="green" onClick={() => onClose(true)}>Yes</Button>
        <Button color="red" onClick={() => onClose(false)}>No</Button>
      </Group>
    </Modal>
  );
};

export default MarketModal;