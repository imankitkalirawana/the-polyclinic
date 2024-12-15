'use client';
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
  Input,
  Link,
  ScrollShadow,
  Select,
  SelectItem,
  user
} from '@nextui-org/react';
import { Genders } from '@/lib/options';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useFormik } from 'formik';
import { CityProps, CountryProps, StateProps, User } from '@/lib/interface';
import { parseDate, getLocalTimeZone, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { userValidationSchema } from '@/lib/validation';
import slugify from 'slugify';
import { scrollToError } from '@/lib/formik';
import { calculateAge, calculateDOB } from '@/lib/client-functions';
import { useRouter } from 'next/navigation';
import { verifyEmail } from '@/functions/server-actions';

export default function NewUser({ countries }: { countries: CountryProps[] }) {
  const router = useRouter();
  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    gender: useRef<HTMLSelectElement>(null),
    age: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    zipcode: useRef<HTMLInputElement>(null)
  };

  const formik = useFormik({
    initialValues: {
      user: {
        name: '',
        email: '',
        phone: '',
        dob: new Date().toISOString().split('T')[0],
        gender: 'male',
        country: 'IN',
        state: '',
        city: '',
        address: '',
        zipcode: ''
      } as User,
      age: 0,
      countries:
        countries?.sort((a, b) => a.name.localeCompare(b.name)) ||
        ([] as CountryProps[]),
      states: [] as StateProps[],
      cities: [] as CityProps[],
      phoneCode: '91'
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      if (!values.user.email) {
        values.user.email = `${values.user.phone}-${slugify(values.user.name, { lower: true })}@devocode.in`;
      }
      if (await verifyEmail(values.user?.email, values.user?._id)) {
        formik.setFieldError('user.email', 'Email already exists');
        return;
      }
      await axios
        .post('/api/users', values.user)
        .then(() => {
          toast.success('User added successfully');
          router.push('/dashboard/users');
        })
        .catch((error: any) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    }
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formik.values.user.country}/states`,
          {
            headers: {
              'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY
            }
          }
        );
        const res2 = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formik.values.user.country}`,
          {
            headers: {
              'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY
            }
          }
        );
        formik.setFieldValue(
          'states',
          response.data?.sort((a: StateProps, b: StateProps) =>
            a.name.localeCompare(b.name)
          )
        );
        formik.setFieldValue('phoneCode', res2.data.phonecode);
      } catch (error) {
        console.log(error);
      }
    };
    if (formik.values.user.country) {
      fetchStates();
    }
  }, [formik.values.user.country]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formik.values.user.country}/states/${formik.values.user.state}/cities`,
          {
            headers: {
              'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY
            }
          }
        );
        formik.setFieldValue(
          'cities',
          response.data?.sort((a: CityProps, b: CityProps) =>
            a.name.localeCompare(b.name)
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (formik.values.user.country && formik.values.user.state) {
      fetchCities();
    }
  }, [formik.values.user.state, formik.values.user.country]);

  useEffect(() => {
    formik.errors?.user && scrollToError(formik.errors?.user, inputRefs);
  }, [formik.isSubmitting]);

  return (
    <>
      <Card className="bg-transparent p-2 shadow-none">
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Add New User</p>
          <div className="sr-only flex gap-4 py-4">
            <Badge
              classNames={{
                badge: 'w-5 h-5'
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
              <p className="font-medium">{user.name}</p>
              <span className="text-small text-default-500">
                {formik.values.user.role}
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
              ref={inputRefs.name}
              label="Name"
              placeholder="Enter Name"
              name="user.name"
              value={formik.values.user.name}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.user?.name && formik.errors.user?.name
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.name && formik.errors.user?.name
              }
            />
            <Input
              label="Email"
              ref={inputRefs.email}
              placeholder="Enter email"
              name="user.email"
              value={formik.values.user.email}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.user?.email && formik.errors.user?.email
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.email && formik.errors.user?.email
              }
            />
            <Input
              label="Phone Number"
              ref={inputRefs.phone}
              placeholder="Enter phone number"
              name="user.phone"
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.user?.phone && formik.errors.user?.phone
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.phone && formik.errors.user?.phone
              }
              value={formik.values.user.phone}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-small text-default-400">
                    +{formik.values.phoneCode}
                  </span>
                </div>
              }
            />
            <Select
              label="Gender"
              ref={inputRefs.gender}
              placeholder="Select Gender"
              selectedKeys={[formik.values.user.gender]}
              name="user.gender"
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.user?.gender && formik.errors.user?.gender
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.gender && formik.errors.user?.gender
              }
              items={Genders}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Input
              ref={inputRefs.age}
              label="Age"
              placeholder="Enter Age"
              name="age"
              type="number"
              value={formik.values.age as any}
              onChange={(e) => {
                const age = e.target.value;
                formik.setFieldValue('age', age);
                if (age) {
                  formik.setFieldValue('user.dob', calculateDOB(age as any));
                }
              }}
              isInvalid={formik.touched.age && formik.errors.age ? true : false}
              errorMessage={formik.touched.age && formik.errors.age}
            />
            <I18nProvider locale="en-IN">
              <DatePicker
                label="DOB (DD-MM-YYYY)"
                onChange={(date) => {
                  const dob =
                    date instanceof Date
                      ? date.toISOString().split('T')[0]
                      : new Date(date as any).toISOString().split('T')[0];
                  formik.setFieldValue('user.dob', dob);
                  formik.setFieldValue('age', calculateAge(dob));
                }}
                value={parseDate(
                  formik.values.user.dob ||
                    new Date().toISOString().split('T')[0]
                )}
                maxValue={today(getLocalTimeZone())}
                showMonthAndYearPickers
              />
            </I18nProvider>
            <Autocomplete
              defaultItems={formik.values.countries}
              label="Country"
              className="grid-cols-2 bg-gradient-to-b"
              placeholder="Select country"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('user.country', value);
              }}
              selectedKey={formik.values.user.country}
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
              defaultItems={formik.values.states}
              label="State"
              placeholder="Select state"
              showScrollIndicators={false}
              isDisabled={formik.values?.states?.length < 1}
              onSelectionChange={(value) => {
                formik.setFieldValue('user.state', value);
              }}
              selectedKey={formik.values.user.state}
            >
              {(item) => (
                <AutocompleteItem key={item.iso2}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <Autocomplete
              defaultItems={formik.values.cities}
              label="City"
              placeholder="Select city"
              showScrollIndicators={false}
              isDisabled={formik.values?.states?.length < 1}
              onSelectionChange={(value) => {
                formik.setFieldValue('user.city', value);
              }}
              selectedKey={formik.values.user.city}
            >
              {(item) => (
                <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              label="Address"
              placeholder="Enter address"
              value={formik.values.user.address}
              onChange={formik.handleChange}
              name="user.address"
              isInvalid={
                formik.touched.user?.address && formik.errors.user?.address
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.address && formik.errors.user?.address
              }
            />
            <Input
              label="Zip Code"
              placeholder="Enter zip code"
              value={formik.values.user.zipcode}
              onChange={formik.handleChange}
              name="user.zipcode"
              isInvalid={
                formik.touched.user?.zipcode && formik.errors.user?.zipcode
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.zipcode && formik.errors.user?.zipcode
              }
            />
          </ScrollShadow>
        </CardBody>

        <CardFooter className="mt-4 justify-end gap-2">
          <Button
            radius="full"
            variant="bordered"
            onPress={() => {
              formik.setFieldValue('user', user);
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            radius="full"
            onPress={() => formik.handleSubmit()}
            isLoading={formik.isSubmitting}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
