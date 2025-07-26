'use client';

import { useState } from 'react';
import { addToast, Button, Tooltip } from '@heroui/react';
import slugify from 'slugify';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function HandleExport({
  collection,
}: {
  collection: 'users' | 'services' | 'drugs' | 'newsletter' | 'appointments' | 'emails';
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
        addToast({
          title: 'File downloaded successfully',
          color: 'success',
        });
      })
      .catch(() => {
        addToast({
          title: 'Error',
          description: 'An error occurred while generating the file',
          color: 'danger',
        });
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  return (
    <Tooltip content="Export to Excel">
      <Button
        endContent={isExporting ? '' : <Icon icon="solar:export-linear" width={18} />}
        onPress={handleExport}
        radius="full"
        variant="flat"
        isIconOnly
        isLoading={isExporting}
      />
    </Tooltip>
  );
}
