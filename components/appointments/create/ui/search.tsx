import { Input } from '@heroui/react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4 flex-shrink-0">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        radius="full"
        variant="bordered"
      />
    </div>
  );
}
