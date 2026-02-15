import { Role } from '@/services/common/user/user.constants';
import { UserFormValues } from '@/services/common/user/user.types';
import { Input, Select, SelectItem } from '@heroui/react';
import { Control, Controller } from 'react-hook-form';

export default function CommonFields({
  control,
  showRole = true,
}: {
  control: Control<UserFormValues>;
  showRole?: boolean;
}) {
  return (
    <>
      <Controller
        name="user.name"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            isRequired
            label="Name"
            placeholder="eg. John Doe"
            value={field.value}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="user.email"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            isRequired
            label="Email"
            placeholder="Enter email"
            value={field.value}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="user.phone"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            maxLength={10}
            label="Phone Number"
            placeholder="Enter phone number"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">+91</span>
              </div>
            }
          />
        )}
      />

      {showRole && (
        <Controller
          name="user.role"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label="Role"
              placeholder="Select Role"
              selectedKeys={[field.value || '']}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            >
              {Object.values(Role).map((role) => (
                <SelectItem key={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
              ))}
            </Select>
          )}
        />
      )}
    </>
  );
}
