import React from 'react';
import { Input, Group, Button } from '@mantine/core';
import { EggImages } from '../../Custom/items';
import { ChickenImages } from '../../Custom/items';

const HeadBar = () => {
  return (
    <Group  style={{ width: '200%', padding: '10px' }}>
      <Input
        icon={<img src={EggImages.egg} alt="Egg Icon" style={{ width: '16px', height: '16px' }} />}
        type="number"
        placeholder="10600"
        styles={{
          input: {
            textAlign: 'center', // 텍스트를 가운데 정렬
          },
        }}  
      />

      <Input
        icon={<img src={ChickenImages.c_classic} alt="Chicken Icon" style={{ width: '16px', height: '16px' }} />}
        type="number"
        placeholder="700"
        styles={{
          input: {
            textAlign: 'center', // 텍스트를 가운데 정렬
          },
        }}
      />
    </Group>
  );
};

export default HeadBar;