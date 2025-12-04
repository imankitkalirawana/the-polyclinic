'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';

import { Header } from './header';
import { AuthProps } from './types';

import Logo from '@/components/ui/logo';
import { BlurIn } from '@/components/ui/text/blur-in';

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

// Reusable Auth Flow Component
const Auth: React.FC<AuthProps> = ({ steps, formik, paginate, footer, showFullPage = true }) => {
  const currentStep = steps[formik.values.page];

  const renderContent = () => (
    <div className="mx-auto mt-2 flex w-full max-w-sm flex-col justify-start gap-4">
      <Header
        title={currentStep?.title}
        description={currentStep?.description}
        isBack={formik.values.page > 0}
        onBack={() => paginate(-1)}
      />
      <AnimatePresence custom={formik.values.direction} initial={false} mode="wait">
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
        <div className="grid h-screen w-screen grid-cols-2 overflow-hidden p-4">
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

export default Auth;
