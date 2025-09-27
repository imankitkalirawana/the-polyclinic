'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/session-provider';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Input,
  NumberInput,
  ScrollShadow,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from '@heroui/react';
import { useFormik } from 'formik';
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Genders } from '@/lib/options';
import { generateEmail, generatePhoneNumber, toCapitalCase } from '@/lib/utils';

import { useCreateUser } from '@/services/common/user/query';
import {
  CreateUser,
  createUserSchema,
  ORGANIZATION_USER_ROLES,
  SYSTEM_USER_ROLE,
  UnifiedUser,
} from '@/services/common/user';
import { withZodSchema } from '@/lib/utils';
import { GENDERS } from '@/lib/constants';
import { useQueryState } from 'nuqs';

// TODO: Remove this after the roles are implemented
const TEMP_DISABLED_ROLES = ['nurse', 'pharmacist', 'laboratorist'];

const getRolesByAccess = (
  role: UnifiedUser['role'] | null | undefined,
  organization?: string | null
) => {
  if (organization) {
    switch (role) {
      case 'superadmin':
      case 'moderator':
      case 'ops':
        return ORGANIZATION_USER_ROLES;
      case 'admin':
        return ORGANIZATION_USER_ROLES;
      case 'receptionist':
        return ['patient'];
      default:
        return [];
    }
  } else {
    switch (role) {
      case 'superadmin':
        return SYSTEM_USER_ROLE;
      case 'moderator':
        return SYSTEM_USER_ROLE.filter((r) => r !== 'superadmin' && r !== 'moderator');
      default:
        return [];
    }
  }
};

export default function NewUser({ organization }: { organization?: string | null }) {
  const router = useRouter();
  const { user } = useSession();
  const [redirectUrl] = useQueryState('redirectUrl', {
    defaultValue: '/dashboard/users',
  });
  const [queryRole] = useQueryState('role', {
    defaultValue: organization ? 'patient' : 'ops',
  });
  const createUser = useCreateUser();

  const formik = useFormik<CreateUser>({
    initialValues: {
      name: '',
      email: '',
      role: queryRole as CreateUser['role'],
      organization,
    },
    validate: withZodSchema(createUserSchema),
    onSubmit: async (values) => {
      await createUser.mutateAsync(values);
      router.push(redirectUrl);
    },
  });

  const handleAutofill = () => {
    const name = faker.person.fullName();
    formik.setFieldValue('name', name);
    formik.setFieldValue('email', generateEmail(name));
    formik.setFieldValue('phone', generatePhoneNumber());
    formik.setFieldValue('gender', faker.helpers.arrayElement(Genders).value);
    formik.setFieldValue('dob', faker.date.birthdate().toISOString().split('T')[0]);
  };

  const roles = getRolesByAccess('moderator', organization);

  return (
    <Card
      className="bg-transparent p-2 shadow-none"
      as={Form}
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
      }}
    >
      <CardHeader className="items-center justify-between px-4 pb-0 pt-4">
        <div>
          <h1 className="text-large">Add New User</h1>
          <p className="text-default-500 text-tiny">
            Fields with <span className="text-red-500">*</span> are required
          </p>
        </div>
        {['superadmin', 'admin'].includes(user?.role || '') && (
          <Button
            startContent={<Icon icon="solar:magic-stick-3-bold-duotone" width={16} />}
            variant="flat"
            onPress={handleAutofill}
          >
            Autofill
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <ScrollShadow className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
          <Input
            isRequired
            label="Name"
            placeholder={formik.values.role === 'doctor' ? 'eg. Dr. John Doe' : 'eg. John Doe'}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.name && formik.errors.name)}
            errorMessage={formik.errors.name}
          />
          <Input
            isRequired
            label="Email"
            placeholder="Enter email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.email && formik.errors.email)}
            errorMessage={formik.touched.email && formik.errors.email}
            endContent={
              user?.role === 'admin' && (
                <Tooltip content="Generate a random email">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    isDisabled={!formik.values.name}
                    onPress={() => {
                      const email = generateEmail(formik.values.name);
                      formik.setFieldValue('email', email);
                    }}
                  >
                    <Icon icon="solar:refresh-bold" />
                  </Button>
                </Tooltip>
              )
            }
          />

          {roles.length > 0 && (
            <Select
              isRequired
              disallowEmptySelection
              label="Role"
              placeholder="Select Role"
              selectedKeys={[formik.values.role]}
              name="role"
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.role && formik.errors.role)}
              errorMessage={formik.touched.role && formik.errors.role}
              items={roles.map((role) => ({
                label: toCapitalCase(role),
                value: role,
              }))}
              disabledKeys={TEMP_DISABLED_ROLES}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
          )}

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            name="phone"
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.phone && formik.errors.phone)}
            endContent={
              user?.role === 'admin' && (
                <Tooltip content="Generate a random phone number">
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    onPress={() => {
                      const phone = generatePhoneNumber();
                      formik.setFieldValue('phone', phone);
                    }}
                  >
                    <Icon icon="solar:refresh-bold" />
                  </Button>
                </Tooltip>
              )
            }
            errorMessage={formik.touched.phone && formik.errors.phone}
            value={formik.values.phone}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">+91</span>
              </div>
            }
          />

          {/* Patients fields */}

          {formik.values.role === 'patient' && (
            <>
              <Select
                label="Gender"
                placeholder="Select Gender"
                selectedKeys={[formik.values.gender || '']}
                name="gender"
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                errorMessage={formik.touched.gender && formik.errors.gender}
                items={GENDERS.map((gender) => ({
                  label: gender.charAt(0).toUpperCase() + gender.slice(1),
                  value: gender,
                }))}
              >
                {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
              </Select>

              <NumberInput
                label="Age"
                placeholder="Enter age"
                value={formik.values.age || 0}
                onChange={(value) =>
                  formik.setFieldValue('age', parseInt(value.toString()) || undefined)
                }
                name="age"
                isInvalid={!!(formik.touched.age && formik.errors.age)}
                errorMessage={formik.touched.age && formik.errors.age}
              />

              <Input
                label="Address"
                placeholder="Enter address"
                value={formik.values.address || ''}
                onChange={formik.handleChange}
                name="address"
                isInvalid={!!(formik.touched.address && formik.errors.address)}
                errorMessage={formik.touched.address && formik.errors.address}
              />
            </>
          )}

          {/* Doctor Fields */}

          {formik.values.role === 'doctor' && (
            <>
              <Input
                label="Specialization"
                placeholder="eg. Cardiologist"
                value={formik.values.specialization || ''}
                onChange={formik.handleChange}
                name="specialization"
                isInvalid={!!(formik.touched.specialization && formik.errors.specialization)}
                errorMessage={formik.touched.specialization && formik.errors.specialization}
              />
              <Input
                label="Department"
                placeholder="eg. Cardiology"
                value={formik.values.department || ''}
                onChange={formik.handleChange}
                name="department"
                isInvalid={!!(formik.touched.department && formik.errors.department)}
                errorMessage={formik.touched.department && formik.errors.department}
              />

              <Input
                label="Seating"
                placeholder="eg. Room No, Floor"
                value={formik.values.seating || ''}
                onChange={formik.handleChange}
                name="seating"
                isInvalid={!!(formik.touched.seating && formik.errors.seating)}
                errorMessage={formik.touched.seating && formik.errors.seating}
              />
              <Input
                label="Education"
                placeholder="eg. MBBS, MD"
                value={formik.values.education || ''}
                onChange={formik.handleChange}
                name="education"
                isInvalid={!!(formik.touched.education && formik.errors.education)}
                errorMessage={formik.touched.education && formik.errors.education}
              />
              <Textarea
                className="col-span-2"
                label="Biography"
                placeholder="eg. Experienced cardiologist"
                value={formik.values.biography || ''}
                onChange={formik.handleChange}
                name="biography"
                isInvalid={!!(formik.touched.biography && formik.errors.biography)}
                errorMessage={formik.touched.biography && formik.errors.biography}
              />
            </>
          )}
        </ScrollShadow>
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button
          color="primary"
          radius="full"
          isLoading={formik.isSubmitting}
          onPress={() => formik.handleSubmit()}
          type="submit"
        >
          Create User
        </Button>
      </CardFooter>
    </Card>
  );
}
