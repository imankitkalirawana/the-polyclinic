'use client';
import { useEffect, useState } from 'react';

export default function Child({ price, quantity }: { price: number; quantity: number }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  return <div>Total: {total}</div>;
}
