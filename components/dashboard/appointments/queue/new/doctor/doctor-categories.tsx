import { DoctorSpecialization } from '@/services/client/doctor';
import { Button } from '@heroui/react';

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
    <div className="mb-4 flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <Button
          key={index}
          title={category.name}
          color={selectedCategory === category.id ? 'primary' : 'default'}
          variant={selectedCategory === category.id ? 'flat' : 'bordered'}
          onPress={() => onSelectCategory?.(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
