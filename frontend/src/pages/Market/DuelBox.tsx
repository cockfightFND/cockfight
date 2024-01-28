import React, { useState } from 'react';
import { Box, Image, Modal, Text } from '@mantine/core'; // Replace with actual imports
import MarketModal from './MarketModal';

const DuelBox = ({ stableChicken, volatileChicken }: {stableChicken: string, volatileChicken: string}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Box 
        sx={{ 
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderRadius: 12, 
            boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)" 
        }}
        >
        <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
          <Text sx={{ marginTop: '20px' }} >Stable Chicken</Text> {/* Text above the image */}
          <Image 
            src={stableChicken} 
            sx={{ 
              width: '100%', 
              height: '100%', 
            }}
          />
        </Box>
        <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
          <Text sx={{ marginTop: '20px' }}>Volatile Chicken</Text> {/* Text above the image */}
          <Image 
            src={volatileChicken} 
            sx={{ 
              width: '100%', 
              height: '100%', 
            }}
          />
        </Box>
      </Box>
      {showModal && <MarketModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default DuelBox;