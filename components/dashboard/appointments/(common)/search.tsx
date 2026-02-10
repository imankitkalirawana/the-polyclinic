import { Input, Spinner } from '@heroui/react';

export default function SearchInput({
  value,
  isLoading = false,
  placeholder = 'Search',
  onChange,
}: {
  value: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4 shrink-0">
      <Input
        endContent={isLoading ? <Spinner size="sm" /> : null}
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
