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
    </>
  );
}
