import { ScrollShadow } from '@heroui/react';
import { cn } from '@heroui/react';
import { RefObject } from 'react';

import SelectionCard from './selection-card';

interface SelectionItem {
  id: string | number;
  image?: string;
  title: string;
  subtitle?: string;
  ref?: RefObject<HTMLDivElement> | ((node: HTMLDivElement) => void);
}

interface SelectionListProps {
  items: SelectionItem[];
  selectedId?: string | number;
  onSelect: (id: string | number) => void;
  isDisabled?: boolean;
  disabledTitle?: string;
  emptyMessage?: string;
  className?: string;
  containerClassName?: string;
}

export default function SelectionList({
  items,
  selectedId,
  onSelect,
  isDisabled = false,
  disabledTitle,
  emptyMessage = 'No items found',
  className,
  containerClassName,
}: SelectionListProps) {
  if (items.length === 0) {
    return (
      <div className={cn('flex h-full items-center justify-center', containerClassName)}>
        <p className="text-sm text-default-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ScrollShadow className={cn('h-full pr-3', containerClassName)}>
      <div className={cn('flex flex-col gap-2', className)}>
        {items.map((item) => (
          <div key={item.id} ref={item.ref}>
            <SelectionCard
              id={item.id}
              image={item.image}
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
