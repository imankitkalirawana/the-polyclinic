import { Input } from '@heroui/react';

export default function PrescriptionPanel() {
  return (
    <div className="p-4">
      <Input label="Title" placeholder="eg. Fever, Cold, etc." />
    </div>
  );
}
