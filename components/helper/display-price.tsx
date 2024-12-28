'use client';
import { formatPrice } from '@/lib/utility';
import { useEffect, useState } from 'react';

export default function PriceDisplay({ price }: { price: number | undefined }) {
  const [formattedPrice, setFormattedPrice] = useState<string | null>(null);

  useEffect(() => {
    if (price !== undefined) {
      setFormattedPrice(formatPrice(price));
    }
  }, [price]);

  return (
    <p className="text-xl font-medium tracking-tight">
      {formattedPrice || 'Loading...'}
    </p>
  );
}
