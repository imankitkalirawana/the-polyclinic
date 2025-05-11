'use client';
import React from 'react';
import {
  addToast,
  Button,
  DatePicker,
  Link,
  Select,
  SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { parseDate, getLocalTimeZone, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { useQueryState } from 'nuqs';
import { Gender } from '@/lib/interface';
import { APP_INFO } from '@/lib/config';

import AuthFlow, { AuthFlowStep } from '../AuthFlow';
import { RegisterProvider, useRegisterFlow } from '../store';
import { Input, OtpInput, PasswordInput } from '../form';

const RegisterComponent: React.FC = () => {
  const { formik, paginate } = useRegisterFlow();
  const [_email, setEmail] = useQueryState('email');

  const REGISTER_STEPS: Record<number, AuthFlowStep> = {
    0: {
      title: 'Sign up in seconds',
      description: `Use your email or another service to continue with ${APP_INFO.name}!`,
      content: (
        <>
          <Button
            fullWidth
            variant="flat"
            startContent={<Icon icon="solar:letter-bold-duotone" width={20} />}
            size="lg"
            color="primary"
            onPress={() => {
              paginate(1);
            }}
          >
            Continue with Email
          </Button>
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="devicon:google" width={20} />}
            size="lg"
            onPress={() => {
              addToast({
                title: 'Coming soon',
                description: 'This feature is coming soon',
                color: 'warning',
              });
            }}
          >
            Continue with Google
          </Button>
          <Button fullWidth variant="light" size="lg">
            Continue another way
          </Button>
        </>
      ),
    },
    1: {
      title: 'Continue with email',
      description:
        "We'll check if you have an account, and help create one if you don't.",
      button: 'Continue',
      content: (
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="john.doe@example.com"
          autoComplete="email"
          autoFocus
          isInvalid={formik.touched.email && formik.errors.email ? true : false}
          errorMessage={formik.errors.email?.toString()}
          value={formik.values.email}
          onChange={(e) => {
            setEmail(e.target.value);
            formik.setFieldValue('email', e.target.value);
          }}
        />
      ),
    },
    2: {
      title: 'Create your account',
      description: `You're creating a ${APP_INFO.name} account with ${formik.values.email}.`,
      button: 'Continue',
      content: (
        <>
          <Input
            label="Name"
            placeholder="John Doe"
            value={formik.values.name}
            onValueChange={(value) => formik.setFieldValue('name', value)}
            isInvalid={formik.touched.name && formik.errors.name ? true : false}
            errorMessage={formik.errors.name?.toString()}
            autoFocus
          />
          <Select
            label="Gender"
            value={formik.values.gender}
            selectedKeys={[formik.values.gender]}
            onSelectionChange={(value) => {
              const gender = Array.from(value)[0] as Gender;
              formik.setFieldValue('gender', gender);
            }}
            disallowEmptySelection
            isInvalid={
              formik.touched.gender && formik.errors.gender ? true : false
            }
            errorMessage={formik.errors.gender?.toString()}
          >
            {Object.values(Gender).map((gender) => (
              <SelectItem key={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </SelectItem>
            ))}
          </Select>
          <I18nProvider locale="en-IN">
            <DatePicker
              label="Date of Birth (Optional)"
              value={formik.values.dob ? parseDate(formik.values.dob) : null}
              onChange={(value) => {
                const dob = new Date(value as any).toISOString().split('T')[0];
                formik.setFieldValue('dob', dob);
              }}
              maxValue={today(getLocalTimeZone())}
              showMonthAndYearPickers
            />
          </I18nProvider>
        </>
      ),
    },
    3: {
      title: "You're almost signed up",
      description: `Enter the code we sent to ${formik.values.email} to finish signing up.`,
      button: 'Continue',
      content: (
        <OtpInput
          email={formik.values.email}
          label="OTP"
          placeholder="Enter OTP"
          value={formik.values.otp}
          onValueChange={(value) => formik.setFieldValue('otp', value)}
          isInvalid={formik.touched.otp && formik.errors.otp ? true : false}
          errorMessage={formik.errors.otp?.toString()}
          autoFocus
          onComplete={() => formik.handleSubmit()}
        />
      ),
    },
    4: {
      title: 'One more step',
      description: `Create a password to secure your account.`,
      button: 'Sign up',
      content: (
        <>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="john.doe@example.com"
            autoComplete="email"
            value={formik.values.email}
            className="sr-only"
          />
          <PasswordInput
            autoFocus
            isValidation
            onValueChange={(value) => formik.setFieldValue('password', value)}
            isInvalid={
              formik.touched.password && formik.errors.password ? true : false
            }
          />
        </>
      ),
    },
  };

  const registerFooter =
    formik.values.page === 0 ? (
      <>
        <div className="text-center text-small">
          By continuing, you agree to {APP_INFO.name}&apos;s{' '}
          <Link className="underline" href={`/terms-of-use`} size="sm">
            Terms of Use
          </Link>
          . Read our{' '}
          <Link className="underline" href={`/privacy-policy`} size="sm">
            Privacy Policy
          </Link>
          .
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px w-full bg-divider" />
          <div className="text-small text-default-500">or</div>
          <div className="h-px w-full bg-divider" />
        </div>
        <div className="text-center text-small">
          Already have an account?&nbsp;
          <Link href={`/auth/login`} size="sm">
            Log In
          </Link>
        </div>
      </>
    ) : undefined;

  return (
    <AuthFlow
      flowType="register"
      steps={REGISTER_STEPS}
      formik={formik}
      paginate={paginate}
      footer={registerFooter}
    />
  );
};

// Wrapper with provider
export default function Register() {
  return (
    <RegisterProvider>
      <RegisterComponent />
    </RegisterProvider>
  );
}
