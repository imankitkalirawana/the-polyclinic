import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { Card } from '@heroui/react';
import { cn } from '@heroui/react';

interface SelectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  disabledTitle?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export default function SelectionCard({
  id,
  title,
  subtitle,
  isSelected,
  isDisabled = false,
  disabledTitle,
  onSelect,
  className,
}: SelectionCardProps) {
  return (
    <Card
      isPressable={!isDisabled}
      isDisabled={isDisabled}
      title={isDisabled ? disabledTitle : undefined}
      className={cn(
        'flex w-full flex-row items-center justify-start gap-4 border-2 border-divider px-4 py-4 shadow-none',
        {
          'border-primary': isSelected,
        },
        className
      )}
      onPress={() => onSelect(id)}
    >
      <RenderUser name={title} description={subtitle} />
    </Card>
  );
}
