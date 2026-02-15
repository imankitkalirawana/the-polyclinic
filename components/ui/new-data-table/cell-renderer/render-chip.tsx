import { Chip } from '@heroui/react';
import { CHIP_CONFIG } from './config';

export default function RenderChip({ value }: { value: string }) {
  return (
    <Chip size="sm" classNames={CHIP_CONFIG[value]}>
      {value}
    </Chip>
  );
}
