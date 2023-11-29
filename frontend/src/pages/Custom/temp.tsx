import React from 'react';
import { Input } from '@mantine/core';
import egg from '../../../img/egg.png'
import chicken from '../../../img/c_classic.png'

const Temp = () => {
  return (
    <>
      <Input
        icon={<img src={egg} alt="Custom Icon" style={{ width: '16px', height: '16px' }} />}
        type="number"
        placeholder="Enter a number"
      />

      <Input
        icon={<img src={chicken} alt="Custom Icon" style={{ width: '16px', height: '16px' }} />}
        type="number"
        placeholder="Enter a number"
      />
    </>
  );
};

export default Temp;