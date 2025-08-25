'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Form,
  Input,
  RadioGroup,
  ScrollShadow,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from '@heroui/react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';

import CustomRadio from '@/components/ui/custom-radio';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { Genders } from '@/lib/options';
import { castData, generateEmail, generatePhoneNumber } from '@/lib/utils';
import { useCreateDoctor } from '@/hooks/queries/client/doctor';
import { useAllUsers } from '@/hooks/queries/client/user';
import { CreateDoctorType } from '@/types/client/doctor';
import { UserType } from '@/types/system/control-plane';

export default function NewDoctor() {
  const router = useRouter();
  const { data: session } = useSession();
  const createDoctor = useCreateDoctor();
  const [inputValue, setInputValue] = useState('');

  const { data: usersData, isLoading: isUsersLoading } = useAllUsers();
  const users = castData<UserType[]>(usersData) || [];

  // Filter users based on input value
  const filteredUsers =
    inputValue === ''
      ? users
      : users.filter(
          (user) =>
            user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            user.email.toLowerCase().includes(inputValue.toLowerCase()) ||
            user.uid.toString().includes(inputValue)
        );

  const formik = useFormik({
    initialValues: {
      creation_type: 'new',
    } as CreateDoctorType,
    // validationSchema: doctorValidationSchema,
    onSubmit: async (values) => {
      await createDoctor.mutateAsync(values).then(() => {
        router.push('/dashboard/doctors');
      });
    },
  });

  return (
    <Card
      className="bg-transparent p-2 shadow-none"
      as={Form}
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
      }}
    >
      <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
        <p className="text-large">Add New Doctor</p>
        <div className="sr-only flex gap-4 py-4">
          <Badge
            classNames={{
              badge: 'w-5 h-5',
            }}
            color="primary"
            content={
              <Button
                isIconOnly
                className="p-0 text-primary-foreground"
                radius="full"
                size="sm"
                variant="light"
              >
                <Icon icon="solar:pen-2-linear" />
              </Button>
            }
            placement="bottom-right"
            shape="circle"
          >
            <Avatar className="h-14 w-14" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
          </Badge>
          <div className="flex flex-col items-start justify-center">
            <p className="font-medium">{formik.values.name}</p>
            <span className="text-small text-default-500">{formik.values.email}</span>
          </div>
        </div>
        <p className="sr-only text-small text-default-400">
          The photo will be used for your profile, and will be visible to other users of the
          platform.
        </p>
      </CardHeader>
      <CardBody>
        <ScrollShadow className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
          <RadioGroup
            label="Select an existing user or create a new doctor"
            orientation="horizontal"
            className="col-span-full"
            value={formik.values.creation_type}
            onValueChange={(value) => {
              formik.setFieldValue('creation_type', value);
            }}
          >
            <CustomRadio description="Create a doctor from scratch" value="new">
              New Doctor
            </CustomRadio>
            <CustomRadio description="Create a doctor from an existing user" value="existing">
              Existing User
            </CustomRadio>
          </RadioGroup>

          {formik.values.creation_type === 'existing' ? (
            <Autocomplete
              isRequired
              isVirtualized
              itemHeight={50}
              label="Select User"
              isLoading={isUsersLoading}
              items={filteredUsers.filter(
                (user) => user.role !== 'doctor' && user.role !== 'admin'
              )}
              className="grid-cols-2 bg-gradient-to-b"
              placeholder="Type to search"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('uid', value);
              }}
              onInputChange={setInputValue}
              selectedKey={formik.values.uid}
              description={
                formik.values.uid
                  ? `UID: #${users.find((user) => user.uid == formik.values.uid)?.uid}`
                  : null
              }
            >
              {(user) => (
                <AutocompleteItem
                  key={user.uid}
                  textValue={user.name}
                  variant="flat"
                  endContent={renderChip({
                    item: user.role,
                    size: 'sm',
                  })}
                >
                  <div className="flex items-center gap-2">
                    <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.image} />
                    <div className="flex flex-col">
                      <span className="text-small">{user.name}</span>
                      <span className="text-tiny text-default-400">{user.email}</span>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          ) : (
            <>
              <Input
                isRequired
                label="Name"
                placeholder="Enter Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.name && formik.errors.name)}
                errorMessage={formik.touched.name && formik.errors.name}
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
                  session?.user?.role === 'admin' && (
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
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                name="phone"
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                endContent={
                  session?.user?.role === 'admin' && (
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
                    <span className="text-small text-default-400">+91</span>
                  </div>
                }
              />
              <Select
                isRequired
                label="Gender"
                placeholder="Select Gender"
                selectedKeys={[formik.values.gender]}
                name="gender"
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                errorMessage={formik.touched.gender && formik.errors.gender}
                items={Genders}
                disallowEmptySelection
              >
                {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
              </Select>
            </>
          )}
          <Divider className="col-span-full" />
          <Input
            label="Designation"
            placeholder="e.g. Cardiologist"
            name="designation"
            value={formik.values.designation}
            onChange={formik.handleChange}
          />
          <Input
            label="Department"
            placeholder="e.g. Cardiology"
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
          />
          <Input
            label="Seating"
            placeholder="e.g. Room 101, Cardiology Wing"
            name="seating"
            value={formik.values.seating}
            onChange={formik.handleChange}
          />
          <Input
            label="Experience"
            placeholder="e.g. 10 years"
            name="experience"
            value={formik.values.experience}
          />
          <Input
            label="Education"
            placeholder="e.g. MBBS, MD"
            name="education"
            value={formik.values.education}
            onChange={formik.handleChange}
          />
          <Textarea
            label="Biography"
            placeholder="e.g. Dr. John Doe is a cardiologist with 10 years of experience."
            name="biography"
            value={formik.values.biography}
            onChange={formik.handleChange}
            className="col-span-full"
          />
          <Input
            label="Short Bio"
            placeholder="e.g. Dr. John Doe is a cardiologist."
            name="shortbio"
            value={formik.values.shortbio}
            onChange={formik.handleChange}
            className="col-span-full"
          />
        </ScrollShadow>
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button color="primary" radius="full" isLoading={formik.isSubmitting} type="submit">
          Create Doctor
        </Button>
      </CardFooter>
    </Card>
  );
}
