'use client';

import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

export default function HandleExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/v1/users/export');
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${slugify(new Date().toString(), { lower: true })}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading the file:', error);
      toast.error('Error downloading the file');
    } finally {
      setIsExporting(false);
    }
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
