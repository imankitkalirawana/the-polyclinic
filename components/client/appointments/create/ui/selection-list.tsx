import { ScrollShadow } from '@heroui/react';
import { cn } from '@heroui/react';

import SelectionCard from './selection-card';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

interface SelectionItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface SelectionListProps {
  items: SelectionItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  disabledTitle?: string;
  className?: string;
  containerClassName?: string;
}

export default function SelectionList({
  items,
  selectedId,
  onSelect,
  isLoading = false,
  isDisabled = false,
  disabledTitle,
  className,
  containerClassName,
}: SelectionListProps) {
  if (isLoading) {
    return (
      <div className={cn('flex h-full items-center justify-center', containerClassName)}>
        <MinimalPlaceholder message="Loading items..." />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn('flex h-full items-center justify-center', containerClassName)}>
        <MinimalPlaceholder message="Looks like the list is empty 😕" isLoading={isLoading} />
      </div>
    );
  }

  return (
    <ScrollShadow className={cn('h-full pr-3', containerClassName)}>
      <div className={cn('flex flex-col gap-2', className)}>
        {items.map((item) => (
          <div key={item.id}>
            <SelectionCard
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              isSelected={selectedId === item.id}
              isDisabled={isDisabled}
              disabledTitle={disabledTitle}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </ScrollShadow>
  );
}
