import { Button, DateRangePicker, Select, SelectItem } from '@heroui/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';

import {
  DEFAULT_APPOINTMENT_QUEUE_FILTERS,
  type AppointmentQueueFilters,
} from '@/services/client/appointment/queue/queue.types';
import { QueueStatus } from '@repo/store';
import { useAllDoctors } from '@/services/client/doctor/doctor.query';
import { getActiveFilterCount } from './helper';

const QUEUE_STATUS_OPTIONS: { value: QueueStatus; label: string }[] = [
  { value: QueueStatus.PAYMENT_PENDING, label: 'Payment Pending' },
  { value: QueueStatus.PAYMENT_FAILED, label: 'Payment Failed' },
  { value: QueueStatus.BOOKED, label: 'Booked' },
  { value: QueueStatus.CALLED, label: 'Called' },
  { value: QueueStatus.IN_CONSULTATION, label: 'In Consultation' },
  { value: QueueStatus.SKIPPED, label: 'Skipped' },
  { value: QueueStatus.CANCELLED, label: 'Cancelled' },
  { value: QueueStatus.COMPLETED, label: 'Completed' },
];

export interface QueueFiltersProps {
  /** Current filter values (e.g. from API or parent state). Used as form initial values. */
  initialValues: AppointmentQueueFilters;
  /** Called when user applies filters. Parent should update state and refetch. */
  onSubmit: (values: AppointmentQueueFilters) => void;
  /** Called when user clears filters. Parent can reset state and close popover. */
  onClear?: () => void;
  /** Called after apply or clear (e.g. close popover). */
  onApplyComplete?: () => void;
}

export function QueueFilters({
  initialValues,
  onSubmit,
  onClear,
  onApplyComplete,
}: QueueFiltersProps) {
  const { control, handleSubmit, reset } = useForm<AppointmentQueueFilters>({
    defaultValues: initialValues,
    values: initialValues,
  });

  const { data: doctorsData } = useAllDoctors();

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit(values);
    onApplyComplete?.();
  });

  const handleClear = () => {
    reset(DEFAULT_APPOINTMENT_QUEUE_FILTERS);
    onSubmit(DEFAULT_APPOINTMENT_QUEUE_FILTERS);
    onClear?.();
    onApplyComplete?.();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
      <Controller
        control={control}
        name="date"
        render={({ field }) => {
          const rangeValue =
            field.value.start && field.value.end
              ? { start: field.value.start, end: field.value.end }
              : undefined;
          return (
            <DateRangePicker
              label="Appointment date"
              value={rangeValue}
              onChange={(range) =>
                field.onChange({
                  start: range?.start ?? null,
                  end: range?.end ?? null,
                })
              }
              onBlur={field.onBlur}
              granularity="day"
            />
          );
        }}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            label="Status"
            placeholder="Any status"
            selectionMode="multiple"
            selectedKeys={field.value?.length ? new Set(field.value) : new Set()}
            onSelectionChange={(keys) => {
              const set = keys as Set<QueueStatus>;
              field.onChange(set.size ? Array.from(set) : undefined);
            }}
            onBlur={field.onBlur}
          >
            {QUEUE_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value}>{opt.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="doctorId"
        render={({ field }) => (
          <Select
            label="Doctor"
            placeholder="All doctors"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0];
              field.onChange(key ?? null);
            }}
            onBlur={field.onBlur}
          >
            {doctorsData?.doctors?.map((d) => <SelectItem key={d.id}>{d.name}</SelectItem>) || []}
          </Select>
        )}
      />

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        {getActiveFilterCount(initialValues) > 0 && (
          <Button
            type="button"
            size="sm"
            variant="flat"
            onPress={handleClear}
            startContent={<Icon icon="solar:refresh-linear" width={16} />}
          >
            Clear
          </Button>
        )}
        <Button type="submit" color="primary" size="sm">
          Apply filters
        </Button>
      </div>
    </form>
  );
}

export default QueueFilters;
