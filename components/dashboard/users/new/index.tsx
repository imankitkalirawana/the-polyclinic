'use client';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
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
  DatePicker,
  Form,
  Input,
  ScrollShadow,
  Select,
  SelectItem,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { CityProps, CountryProps, StateProps } from '@/types';
import { Genders } from '@/lib/options';
import { userValidationSchema } from '@/lib/validation';
import { CreateUserType, userRoles } from '@/types/user';
import {
  useAllCitiesByCountryAndState,
  useAllCountries,
  useAllStatesByCountry,
} from '@/services/external';
import { useCreateUser } from '@/services/user';
import { useSession } from 'next-auth/react';
import { generateEmail, generatePhoneNumber, toCapitalCase } from '@/lib/utils';

export default function NewUser() {
  const router = useRouter();
  const { data: session } = useSession();
  const createUser = useCreateUser();

  const { data: countriesData, isLoading: isCountriesLoading } =
    useAllCountries();
  const countries: CountryProps[] = countriesData || [];

  const formik = useFormik({
    initialValues: {
      role: 'user',
    } as CreateUserType,
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      await createUser.mutateAsync(values).then(() => {
        router.push('/dashboard/users');
      });
    },
  });

  const { data: statesData, isLoading: isStatesLoading } =
    useAllStatesByCountry(formik.values.country);

  const { data: citiesData, isLoading: isCitiesLoading } =
    useAllCitiesByCountryAndState(formik.values.country, formik.values.state);

  const states: StateProps[] = statesData || [];
  const cities: CityProps[] = citiesData || [];

  return (
    <>
      <Card
        className="bg-transparent p-2 shadow-none"
        as={Form}
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Add New User</p>
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
              <Avatar
                className="h-14 w-14"
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              />
            </Badge>
            <div className="flex flex-col items-start justify-center">
              <p className="font-medium">{formik.values.name}</p>
              <span className="text-small text-default-500">
                {formik.values.role}
              </span>
            </div>
          </div>
          <p className="sr-only text-small text-default-400">
            The photo will be used for your profile, and will be visible to
            other users of the platform.
          </p>
        </CardHeader>
        <CardBody>
          <ScrollShadow className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
            <Input
              isRequired
              label="Name"
              placeholder="Enter Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.name && formik.errors.name ? true : false
              }
              errorMessage={formik.touched.name && formik.errors.name}
            />
            <Input
              isRequired
              label="Email"
              placeholder="Enter email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.email && formik.errors.email ? true : false
              }
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
              isInvalid={
                formik.touched.phone && formik.errors.phone ? true : false
              }
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
              isInvalid={
                formik.touched.gender && formik.errors.gender ? true : false
              }
              errorMessage={formik.touched.gender && formik.errors.gender}
              items={Genders}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            {session?.user?.role === 'admin' && (
              <Select
                disallowEmptySelection
                label="Role"
                placeholder="Select Role"
                selectedKeys={[formik.values.role]}
                name="role"
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.role && formik.errors.role ? true : false
                }
                errorMessage={formik.touched.role && formik.errors.role}
                items={userRoles.map((role) => ({
                  label: toCapitalCase(role),
                  value: role,
                }))}
              >
                {(item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                )}
              </Select>
            )}

            <I18nProvider locale="en-IN">
              <DatePicker
                name="dob"
                label="Date of Birth (Optional)"
                // @ts-expect-error
                value={formik.values.dob ? parseDate(formik.values.dob) : null}
                onChange={(value) => {
                  const dob = new Date(value as any)
                    .toISOString()
                    .split('T')[0];
                  formik.setFieldValue('dob', dob);
                }}
                maxValue={today(getLocalTimeZone())}
                showMonthAndYearPickers
              />
            </I18nProvider>
            <Autocomplete
              label="Country (Optional)"
              isLoading={isCountriesLoading}
              defaultItems={countries}
              className="grid-cols-2 bg-gradient-to-b"
              placeholder="Select country"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('country', value);
              }}
              selectedKey={formik.values.country}
            >
              {(item) => (
                <AutocompleteItem
                  key={item.iso2}
                  startContent={<>{item.emoji}</>}
                >
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Autocomplete
              isLoading={isStatesLoading}
              defaultItems={states}
              label="State (Optional)"
              placeholder="Select state"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('state', value);
              }}
              selectedKey={formik.values.state}
            >
              {(item) => (
                <AutocompleteItem key={item.iso2}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <Autocomplete
              isLoading={isCitiesLoading}
              defaultItems={cities}
              label="City (Optional)"
              placeholder="Select city"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('city', value);
              }}
              selectedKey={formik.values.city}
            >
              {(item) => (
                <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              label="Address (Optional)"
              placeholder="Enter address"
              value={formik.values.address}
              onChange={formik.handleChange}
              name="address"
              isInvalid={
                formik.touched.address && formik.errors.address ? true : false
              }
              errorMessage={formik.touched.address && formik.errors.address}
            />
            <Input
              label="Zip Code (Optional)"
              placeholder="Enter zip code"
              value={formik.values.zipcode}
              onChange={formik.handleChange}
              name="zipcode"
              isInvalid={
                formik.touched.zipcode && formik.errors.zipcode ? true : false
              }
              errorMessage={formik.touched.zipcode && formik.errors.zipcode}
            />
          </ScrollShadow>
        </CardBody>

        <CardFooter className="mt-4 justify-end gap-2">
          <Button
            color="primary"
            radius="full"
            isLoading={formik.isSubmitting}
            type="submit"
          >
            Create User
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
