'use client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
  Link,
  ScrollShadow,
  Select,
  SelectItem,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { signIn } from 'next-auth/react';
import VerifyId from './modals/verify-id';
import { useForm } from './context';
import { verifyEmail } from '@/functions/server-actions';

export default function DetailsInput() {
  const { formik } = useForm();

  const ModalMap: Record<number, React.ReactNode> = {
    2: <VerifyId />,
    4: <>Step 3</>
  };

  return (
    <>
      <Card className="mx-auto flex max-w-2xl flex-col px-2 py-4 lg:px-8">
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
          <ScrollShadow className="grid grid-cols-6 gap-4 p-2">
            <Input
              label="First Name"
              value={formik.values.firstName}
              name="firstName"
              onChange={formik.handleChange}
              className="col-span-3"
              isInvalid={
                formik.touched.firstName && formik.errors.firstName
                  ? true
                  : false
              }
              errorMessage={
                <div className="flex items-center gap-1">
                  <Icon icon="solar:info-circle-bold" width="14" />
                  <span>{formik.errors.firstName}</span>
                </div>
              }
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
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
              isInvalid={
                formik.touched.dob?.day && formik.errors.dob?.day ? true : false
              }
              errorMessage={
                <div className="flex items-center gap-1">
                  <Icon icon="solar:info-circle-bold" width="14" />
                  <span>{formik.errors.dob?.day}</span>
                </div>
              }
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
              isInvalid={
                formik.touched.dob?.month && formik.errors.dob?.month
                  ? true
                  : false
              }
              errorMessage={
                <div className="flex items-center gap-1">
                  <Icon icon="solar:info-circle-bold" width="14" />
                  <span>{formik.errors.dob?.month}</span>
                </div>
              }
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
              isInvalid={
                formik.touched.dob?.year && formik.errors.dob?.year
                  ? true
                  : false
              }
              errorMessage={
                <div className="flex items-center gap-1">
                  <Icon icon="solar:info-circle-bold" width="14" />
                  <span>{formik.errors.dob?.year}</span>
                </div>
              }
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
              isReadOnly={formik.values.step > 1}
              value={formik.values.id}
              onChange={formik.handleChange}
              className="col-span-full"
              startContent={
                // automaitcally detect if email or phone number after 3 characters are entered and show +91 for phone number and empty for email also check if the entered character is a number or not before showing +91
                formik.values.id.length > 3 &&
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
              isInvalid={formik.touched.id && formik.errors.id ? true : false}
              errorMessage={
                <div className="flex items-center gap-1">
                  <Icon icon="solar:info-circle-bold" width="14" />
                  <span>{formik.errors.id}</span>
                </div>
              }
              description={
                formik.values.step > 2 && (
                  <>
                    <Link
                      href="#"
                      onPress={() => {
                        formik.setValues({
                          ...formik.values,
                          step: 1,
                          otp: ''
                        });
                      }}
                      className="text-xs"
                    >
                      Change
                    </Link>
                  </>
                )
              }
            />
            <hr className="col-span-full my-2 border-t border-divider" />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="col-span-full"
              isInvalid={
                formik.touched.password && formik.errors.password ? true : false
              }
              errorMessage={
                <div className="flex items-center gap-1">
                  <Icon icon="solar:info-circle-bold" width="14" />
                  <span>{formik.errors.password}</span>
                </div>
              }
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className="col-span-full"
              isInvalid={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? true
                  : false
              }
              errorMessage={
                <div className="flex items-center gap-1">
                  <Icon icon="solar:info-circle-bold" width="14" />
                  <span>{formik.errors.confirmPassword}</span>
                </div>
              }
            />
          </ScrollShadow>
        </CardBody>
        <CardFooter className="justify-end gap-4">
          <Button radius="lg" variant="bordered">
            Cancel
          </Button>
          <Button
            radius="lg"
            color="primary"
            onPress={() => {
              formik.handleSubmit();
            }}
            isLoading={formik.isSubmitting}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
      {ModalMap[formik.values.step]}
    </>
  );
}
