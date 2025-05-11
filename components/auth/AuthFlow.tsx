'use client';
import React, { ReactNode } from 'react';
import { Button, Link, addToast } from '@heroui/react';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useFormik } from 'formik';
import { useQueryState } from 'nuqs';
import Logo from '@/components/ui/logo';
import { BlurIn } from '@/components/ui/text/blur-in';

// Types
export type AuthFlowStep = {
  title: string;
  description?: string;
  button?: string;
  content?: ReactNode;
};

export interface AuthFlowProps {
  flowType: 'register' | 'login' | 'forgot-password';
  steps: Record<number, AuthFlowStep>;
  formik: ReturnType<typeof useFormik<any>>;
  paginate: (newDirection: number) => void;
  footer?: ReactNode;
  showFullPage?: boolean;
}

// Animation variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};

// Header Component
export const Header = ({
  title,
  description,
  isBack,
  onBack,
}: {
  title: string;
  description?: string;
  isBack?: boolean;
  onBack?: () => void;
}) => {
  return (
    <m.div layout className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {isBack && (
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => onBack?.()}
            aria-label="Go back"
          >
            <span className="sr-only">Go back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-default-500"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        )}
        <m.h1
          layout
          className="text-xl font-medium"
          transition={{ duration: 0.25 }}
        >
          {title}
        </m.h1>
      </div>
      {description && (
        <m.p
          layout
          className="text-sm text-default-500"
          transition={{ duration: 0.25 }}
        >
          {description}
        </m.p>
      )}
    </m.div>
  );
};

// Reusable Auth Flow Component
const AuthFlow: React.FC<AuthFlowProps> = ({
  flowType,
  steps,
  formik,
  paginate,
  footer,
  showFullPage = true,
}) => {
  const [_email, setEmail] = useQueryState('email');

  const currentStep = steps[formik.values.page];

  const renderContent = () => (
    <div className="mx-auto mt-2 flex w-full max-w-sm flex-col justify-start gap-4">
      <Header
        title={currentStep?.title}
        description={currentStep?.description}
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
          {currentStep?.content}
          {currentStep?.button && (
            <Button
              type="submit"
              color="primary"
              isLoading={formik.isSubmitting}
              variant="shadow"
              radius="lg"
              fullWidth
              className="mt-4 py-6"
            >
              {currentStep.button}
            </Button>
          )}
        </m.form>
      </AnimatePresence>

      <AnimatePresence>
        {footer && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2"
          >
            {footer}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (showFullPage) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="grid h-screen w-full grid-cols-2 p-4">
          <div className="flex h-full items-center justify-center rounded-large bg-black">
            <BlurIn>
              <Logo className="text-background" />
            </BlurIn>
          </div>
          {renderContent()}
        </div>
      </LazyMotion>
    );
  }

  return <div className="w-full">{renderContent()}</div>;
};

export default AuthFlow;
