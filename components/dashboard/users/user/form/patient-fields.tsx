import { GENDERS } from '@/libs/constants';
import { handleDateChange } from '@/libs/utils';
import { UserFormValues } from '@/services/common/user/user.types';
import { DatePicker, Input, Select, SelectItem } from '@heroui/react';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { Control, Controller } from 'react-hook-form';

export default function PatientFields({ control }: { control: Control<UserFormValues> }) {
  return (
    <>
      <Controller
        name="patient.gender"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            ref={field.ref}
            label="Gender"
            placeholder="Select Gender"
            selectedKeys={[field.value || '']}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          >
            {Object.values(GENDERS).map((gender) => (
              <SelectItem key={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="patient.dob"
        control={control}
        render={({ field, fieldState }) => (
          <I18nProvider locale="en-IN">
            <DatePicker
              {...field}
              showMonthAndYearPickers
              minValue={today(getLocalTimeZone()).subtract({ years: 120 })}
              maxValue={today(getLocalTimeZone())}
              label="Date of Birth"
              value={field.value ? parseDate(field.value.split('T')[0]) : null}
              onChange={(value) => field.onChange(handleDateChange(value))}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          </I18nProvider>
        )}
      />

      <Controller
        name="patient.address"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Address"
            placeholder="Enter address"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="patient.bloodType"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Blood Type"
            placeholder="e.g. O+"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="patient.height"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="number"
            label="Height (cm)"
            placeholder="Enter height"
            value={field.value?.toString() ?? ''}
            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="patient.weight"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="number"
            label="Weight (kg)"
            placeholder="Enter weight"
            value={field.value?.toString() ?? ''}
            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="patient.bloodPressure"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Blood Pressure"
            placeholder="e.g. 120/80"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="patient.heartRate"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type="number"
            label="Heart Rate (bpm)"
            placeholder="e.g. 72"
            value={field.value?.toString() ?? ''}
            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="patient.allergies"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Allergy"
            placeholder="Enter allergy details"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}
