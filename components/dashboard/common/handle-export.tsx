'use client';

import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

export default function HandleExport({
  collection
}: {
  collection: 'users' | 'services' | 'drugs' | 'newsletter' | 'appointments';
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await fetch(`/api/v1/${collection}/export`)
      .then(async (response) => {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${collection}-${slugify(new Date().toString(), { lower: true })}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        toast.success('File downloaded successfully');
      })
      .catch(() => {
        toast.error('An error occurred while generating the file');
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  return (
    <>
      <Tooltip content="Export to Excel">
        <Button
          endContent={
            isExporting ? '' : <Icon icon="solar:export-linear" width={18} />
          }
          onPress={handleExport}
          radius="full"
          variant="flat"
          isIconOnly
          isLoading={isExporting}
        />
      </Tooltip>
    </>
  );
}
