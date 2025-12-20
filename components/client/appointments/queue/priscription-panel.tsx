'use client';

import { useState } from 'react';
import { Input } from '@heroui/react';
import Editor from '@/components/ui/text-editor/editor';

export default function PrescriptionPanel() {
  const [content, setContent] = useState('');

  return (
    <div className="flex flex-col gap-4 p-4">
      <Input label="Title" placeholder="eg. Fever, Cold, etc." />
      <span className="text-default-500 text-tiny">Priscription</span>
      <Editor content={content} onChange={setContent} />
    </div>
  );
}
