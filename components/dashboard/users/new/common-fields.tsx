import { Controller, useFormContext } from 'react-hook-form';
import { Input, Select, SelectItem, Tooltip, Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { generateEmail, generatePhoneNumber, toTitleCase } from '@/lib/utils';
import { CreateUser, Role } from '@/services/common/user';
import { useSession } from '@/lib/providers/session-provider';

export default function CommonFields() {
  const form = useFormContext<CreateUser>();
  const { user } = useSession();
  const {
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;
  const name = watch('name');

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            autoFocus
            isRequired
            label="Name"
            placeholder="eg. John Doe"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Email"
            placeholder="Enter email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            endContent={
              user?.role === Role.ADMIN && (
                <Tooltip content="Generate a random email">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    isDisabled={!name}
                    onPress={() => {
                      const email = generateEmail(name || '');
                      setValue('email', email, { shouldValidate: true, shouldDirty: true });
                    }}
                  >
                    <Icon icon="solar:refresh-bold" />
                  </Button>
                </Tooltip>
              )
            }
          />
        )}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isRequired
            disallowEmptySelection
            label="Role"
            placeholder="Select Role"
            isInvalid={!!errors.role}
            errorMessage={errors.role?.message}
            items={Object.values(Role).map((role) => ({
              label: toTitleCase(role),
              value: role,
            }))}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Phone Number"
            placeholder="Enter phone number"
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
            endContent={
              user?.role === Role.ADMIN && (
                <Tooltip content="Generate a random phone number">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    onPress={() => {
                      const phone = generatePhoneNumber();
                      setValue('phone', phone, { shouldValidate: true, shouldDirty: true });
                    }}
                  >
                    <Icon icon="solar:refresh-bold" />
                  </Button>
                </Tooltip>
              )
            }
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">+91</span>
              </div>
            }
          />
        )}
      />
    </>
  );
}
