'use client';
import React from 'react';
import Image from 'next/image';
import { Button, Code, Input } from '@nextui-org/react';
import { useQueryState, parseAsInteger } from 'nuqs';

export default function Home() {
  const [name, setName] = useQueryState('name');
  const [count, setCount] = useQueryState('count', parseAsInteger);

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center space-y-10">
        <Image
          width={512}
          height={512}
          src="/logo.png"
          alt="Platforms on Vercel"
          className="w-48"
        />
        <Input
          value={name || ''}
          onChange={(e) => {
            setName(e.target.value || null);
          }}
        />
        <h1>
          Edit this page on
          <Code>app/home/page.tsx</Code>
        </h1>
        <p>Hello, {name || 'anonymous visitor'}!</p>
        <div>
          <pre>count: {count}</pre>
          <Button onClick={() => setCount(0)}>Reset</Button>
          {/* handling null values in setCount is annoying: */}
          <Button onClick={() => setCount((c) => (c ?? 0) + 1)}>+</Button>
          <Button onClick={() => setCount((c) => (c ?? 0) - 1)}>-</Button>
          <Button onClick={() => setCount(null)}>Clear</Button>
        </div>
      </div>
    </>
  );
}
