import { Chip, ChipProps } from '@heroui/react';

const CHIP_CONFIG: Record<string, ChipProps['classNames']> = {
  // For roles
  ADMIN: {
    base: 'bg-red-100 text-red-700',
    content: 'text-red-700',
  },
  DOCTOR: {
    base: 'bg-blue-100 text-blue-700',
    content: 'text-blue-700',
  },
  NURSE: {
    base: 'bg-amber-100 text-amber-700',
    content: 'text-amber-700',
  },
};

export function ChipRenderer({ value }: { value: string }) {
  return (
    <Chip size="sm" classNames={CHIP_CONFIG[value]}>
      {value}
    </Chip>
  );
}
