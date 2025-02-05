'use client';
import AsyncButton from '@/components/ui/buttons/async-button';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
  ScrollShadow,
  Select,
  SelectItem,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import VerifyId from './verify-id';

export default function DetailsInput() {
  const formik = useFormik({
    initialValues: {
      name: '',
      dob: {
        day: '',
        month: '',
        year: ''
      },
      id: '',
      reason: ''
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  return (
    <>
      <Card className="mx-auto flex max-w-2xl flex-col">
        <CardHeader className="flex-col gap-2">
          <div>
            <Image src="/logo.png" className="p-2" radius="full" width={72} />
          </div>
          <h2 className="text-2xl font-semibold">Book An Appointment</h2>
          <div className="text-center">
            <p>An account is required to book an appointment. </p>
            <p>
              Already have an Account?{' '}
              <Link
                href="#"
                onPress={() => {
                  signIn();
                }}
                className="hover:underline"
              >
                Sign In <Icon icon="tabler:arrow-up-right" width={18} />
              </Link>
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <ScrollShadow className="md:px4 grid grid-cols-6 gap-4 px-2 py-4 lg:px-8">
            <Input
              label="First Name"
              value={formik.values.name.split(' ')[0] || ''}
              name="firstname"
              onChange={(e) => {
                formik.setFieldValue(
                  'name',
                  `${e.target.value} ${formik.values.name.split(' ')[1]}`
                );
              }}
              className="col-span-3"
            />
            <Input
              label="Last Name"
              value={formik.values.name.split(' ')[1] || ''}
              name="lastname"
              onChange={(e) => {
                formik.setFieldValue(
                  'name',
                  `${formik.values.name.split(' ')[0]} ${e.target.value}`
                );
              }}
              className="col-span-3"
            />
            <div className="col-span-full flex items-center gap-2 font-medium">
              <p>Birthday</p>
              <Tooltip
                className="max-w-48"
                showArrow
                content="This informtion is used by the doctors to prescribe the right medicine."
              >
                <Icon
                  icon="solar:question-circle-bold"
                  width="24"
                  height="24"
                />
              </Tooltip>
            </div>
            <Select
              aria-label="Day"
              label="Day"
              className="col-span-2"
              selectedKeys={[formik.values.dob.day]}
              name="dob.day"
              onChange={formik.handleChange}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <SelectItem key={`${i + 1}`} textValue={`${i + 1}`}>
                  {i + 1}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="col-span-2"
              label="Month"
              aria-label="Month"
              selectedKeys={[formik.values.dob.month]}
              name="dob.month"
              onChange={formik.handleChange}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(0, i).toLocaleString('default', {
                  month: 'long'
                });
                return (
                  <SelectItem key={i + 1} textValue={month}>
                    {month}
                  </SelectItem>
                );
              })}
            </Select>
            <Select
              className="col-span-2"
              label="Year"
              aria-label="Year"
              selectedKeys={[formik.values.dob.year]}
              name="dob.year"
              onChange={formik.handleChange}
            >
              {Array.from(
                { length: new Date().getFullYear() - 1875 + 1 },
                (_, i) => (
                  <SelectItem
                    key={new Date().getFullYear() - i}
                    textValue={`${new Date().getFullYear() - i}`}
                  >
                    {new Date().getFullYear() - i}
                  </SelectItem>
                )
              )}
            </Select>
            <hr className="col-span-full my-2 border-t border-divider" />
            <Input
              label="Email / Phone"
              name="id"
              value={formik.values.id}
              onChange={formik.handleChange}
              className="col-span-full"
              startContent={
                // automaitcally detect if email or phone number after 3 characters are entered and show +91 for phone number and empty for email also check if the entered character is a number or not before showing +91
                formik.values.id.length > 3 &&
                formik.values.id.length < 10 &&
                !isNaN(Number(formik.values.id)) ? (
                  <select
                    className="border-0 bg-transparent text-small text-default-400 outline-none"
                    id="countryCode"
                    name="countryCode"
                    value={'+91'}
                  >
                    <option value="+91">+91</option>
                  </select>
                ) : null
              }
              //   endContent={
              //     <Button variant="light" color="primary" size="sm">
              //       Verify
              //     </Button>
              //   }
            />
            <hr className="col-span-full my-2 border-t border-divider" />
          </ScrollShadow>
        </CardBody>
        <CardFooter className="justify-end gap-4">
          <Button radius="lg" variant="bordered">
            Cancel
          </Button>
          <AsyncButton radius="lg" color="primary">
            Continue
          </AsyncButton>
        </CardFooter>
      </Card>
      <VerifyId />
    </>
  );
}
