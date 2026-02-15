import { DoctorSpecialization } from '@/services/client/doctor';
import { Button, Popover, PopoverContent, PopoverTrigger, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function DoctorCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: DoctorSpecialization[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <h3 className="text-default-500 text-sm">Filter by Specialization</h3>
      <ScrollShadow hideScrollBar orientation="horizontal" className="flex gap-2">
        <Button
          color={selectedCategory === '' ? 'primary' : 'default'}
          variant={selectedCategory === '' ? 'flat' : 'bordered'}
          onPress={() => onSelectCategory?.('')}
        >
          All
        </Button>
        {categories.map((category, index) => (
          <Button
            key={index}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            variant={selectedCategory === category.id ? 'flat' : 'bordered'}
            onPress={() => onSelectCategory?.(category.id)}
            className="shrink-0"
            endContent={
              <Popover showArrow className="max-w-64">
                <PopoverTrigger>
                  <button type="button" className="m-0 cursor-pointer p-0">
                    <Icon icon="solar:info-circle-bold-duotone" width={16} />
                  </button>
                </PopoverTrigger>
                <PopoverContent>{category.description}</PopoverContent>
              </Popover>
            }
          >
            {category.name}
          </Button>
        ))}
      </ScrollShadow>
    </div>
  );
}
