import { Chip, Tooltip, cn } from '@heroui/react';
import { CHIP_CONFIG } from './config';
import { formatLabel } from '@/shared';

export default function RenderChip({
  value,
  isDotOnly = false,
}: {
  value: string | null | undefined;
  isDotOnly?: boolean;
}) {
  if (!value) return null;

  return (
    <Tooltip
      delay={500}
      content={formatLabel(value)}
      classNames={CHIP_CONFIG[value]}
      isDisabled={!isDotOnly}
    >
      <Chip
        size="sm"
        className={cn('rounded-full', {
          'aspect-square size-3': isDotOnly,
        })}
        classNames={CHIP_CONFIG[value]}
      >
        {isDotOnly ? null : formatLabel(value)}
      </Chip>
    </Tooltip>
  );
}
