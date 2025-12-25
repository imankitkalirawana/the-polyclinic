'use client';
import { Button } from '@heroui/react';
import Child from './child';
import { useState } from 'react';

export default function Test() {
  const [price, setPrice] = useState(10);
  const quantity = 2;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          color="primary"
          variant="flat"
          isIconOnly
          onPress={() => setPrice((price) => price + 1)}
        >
          -
        </Button>
        INR {price}
        <Button
          color="primary"
          variant="flat"
          isIconOnly
          onPress={() => setPrice((price) => price + 1)}
        >
          +
        </Button>
      </div>
      <Child price={price} quantity={quantity} />
    </div>
  );
}
