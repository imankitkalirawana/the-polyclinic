'use client';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@heroui/react';

export default function TestPage() {
  const [value, setValue] = useLocalStorage<string>('my-key', 'initial value');

  return (
    <div>
      <p>Value: {value}</p>
      <Button onPress={() => setValue('new value')}>Update Value</Button>
      <Button onPress={() => setValue((prev) => `${prev}!`)}>Append !</Button>
    </div>
  );
}
