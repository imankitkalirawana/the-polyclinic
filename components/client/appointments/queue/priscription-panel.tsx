'use client';

import { Input } from '@heroui/react';
import Editor from '@/components/ui/text-editor/editor';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@heroui/react';

export const prescriptionFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  prescription: z.string().min(1, 'Prescription is required'),
});

export type PrescriptionFormSchema = z.infer<typeof prescriptionFormSchema>;

export default function PrescriptionPanel() {
  const form = useFormContext<PrescriptionFormSchema>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <Input
        {...form.register('title')}
        label="Title"
        placeholder="eg. Fever, Cold, etc."
        errorMessage={form.formState.errors.title?.message}
        isInvalid={!!form.formState.errors.title}
      />
      <span className="text-default-500 text-tiny">Prescription</span>
      <Editor
        content={form.watch('prescription')}
        onChange={(html) => form.setValue('prescription', html, { shouldValidate: true })}
        className={cn({
          'bg-danger-50': form.formState.errors.prescription,
        })}
      />
      {form.formState.errors.prescription && (
        <span className="text-danger text-tiny">{form.formState.errors.prescription.message}</span>
      )}
    </div>
  );
}
