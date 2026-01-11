import { Input } from '@heroui/react';

export default function SearchInput({
  value,
  placeholder = 'Search',
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4 flex-shrink-0">
      <Input
        className="max-w-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        radius="full"
        variant="bordered"
      />
    </div>
  );
}
