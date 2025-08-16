import { Avatar, Card } from '@heroui/react';
import { cn } from '@heroui/react';

interface SelectionCardProps {
  id: string | number;
  image?: string;
  title: string;
  subtitle?: string;
  isSelected: boolean;
  isDisabled?: boolean;
  disabledTitle?: string;
  onSelect: (id: string | number) => void;
  className?: string;
}

export default function SelectionCard({
  id,
  image,
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
        'flex h-full min-h-16 flex-row items-center justify-start gap-4 border-2 border-divider px-4 py-4 shadow-none',
        {
          'border-primary': isSelected,
        },
        className
      )}
      onPress={() => onSelect(id)}
    >
      <Avatar src={image} />
      <div className="flex flex-col items-start gap-0">
        <h4 className="text-small">{title}</h4>
        {subtitle && <p className="text-sm text-default-500">{subtitle}</p>}
      </div>
    </Card>
  );
}
