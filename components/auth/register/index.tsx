'use client';
import {
  addToast,
  Button,
  DatePicker,
  Link,
  Select,
  SelectItem,
} from '@heroui/react';

import { Input, OtpInput, PasswordInput, SubmitButton } from '../form';
import { RegisterHeader } from './header';
import { useRegister } from './store';
import { RegisterStep } from './types';
import { APP_INFO } from '@/lib/config';
import { Icon } from '@iconify/react/dist/iconify.js';
import { parseDate, getLocalTimeZone, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { Gender } from '@/lib/interface';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import { variants } from './schema';
import { useQueryState } from 'nuqs';

export default function Register() {
  const { formik, paginate } = useRegister();
  const [email, setEmail] = useQueryState('email');

  const PAGES: Record<number, RegisterStep> = {
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
        <>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="john.doe@example.com"
            autoComplete="email"
            isInvalid={
              formik.touched.email && formik.errors.email ? true : false
            }
            errorMessage={formik.errors.email}
            value={formik.values.email}
            onChange={(e) => {
              setEmail(e.target.value);
              formik.setFieldValue('email', e.target.value);
            }}
          />
        </>
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
            errorMessage={formik.errors.name}
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
            errorMessage={formik.errors.gender}
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
          errorMessage={formik.errors.otp}
        />
      ),
    },
    4: {
      title: 'Create your password',
      description: `Create a password to secure your account.`,
      button: 'Continue',
      content: (
        <PasswordInput
          isValidation
          onValueChange={(value) => formik.setFieldValue('password', value)}
          isInvalid={
            formik.touched.password && formik.errors.password ? true : false
          }
        />
      ),
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid h-screen w-full grid-cols-2 p-4">
        <div className="h-full rounded-large bg-foreground"></div>
        <div className="mx-auto mt-2 flex w-full max-w-sm flex-col justify-start gap-4">
          <RegisterHeader
            title={PAGES[formik.values.page]?.title}
            description={PAGES[formik.values.page]?.description}
            isBack={formik.values.page > 0}
            onBack={() => paginate(-1)}
          />
          <AnimatePresence
            custom={formik.values.direction}
            initial={false}
            mode="wait"
          >
            <m.form
              key={formik.values.page}
              animate="center"
              custom={formik.values.direction}
              exit="exit"
              initial="enter"
              transition={{
                duration: 0.25,
              }}
              variants={variants}
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              className="flex flex-col items-center gap-2"
            >
              {PAGES[formik.values.page]?.content}
              {PAGES[formik.values.page]?.button && (
                <SubmitButton
                  isLoading={formik.isSubmitting}
                  className="mt-4 w-full py-6"
                >
                  {PAGES[formik.values.page]?.button}
                </SubmitButton>
              )}
            </m.form>
          </AnimatePresence>

          <AnimatePresence>
            {formik.values.page === 0 && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2"
              >
                <div className="text-center text-small">
                  By continuing, you agree to {APP_INFO.name}&apos;s{' '}
                  <Link className="underline" href={`/terms-of-use`} size="sm">
                    Terms of Use
                  </Link>
                  . Read our{' '}
                  <Link
                    className="underline"
                    href={`/privacy-policy`}
                    size="sm"
                  >
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
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
