import React from 'react';
import { Image } from '@heroui/react';

interface Props {
  message?: string;
  description?: string;
}

export default function NoResults({ message = 'No Results Found', description }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Image src="/assets/not-found.svg" width={200} height={200} alt="Not Found" />
      <h3 className="text-2xl font-semibold text-primary">{message}</h3>
      <p className="text-center text-default-700">{description}</p>
    </div>
  );
}
