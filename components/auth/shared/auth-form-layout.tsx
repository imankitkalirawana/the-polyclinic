'use client';

import React, { ReactNode } from 'react';
import { Button } from '@heroui/react';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import { BlurIn } from '@/components/ui/text/blur-in';
import Logo from '@/components/ui/logo';
import { Header } from '../ui/header';
import { stepVariants } from './variants';

export interface AuthFormLayoutProps {
  title: string;
  description?: string;
  isBack: boolean;
  onBack: () => void;
  formContent: ReactNode;
  submitLabel?: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  footer?: ReactNode;
  stepKey: number;
}

/**
 * Shared two-column auth layout: logo left, form right with header, animated step content, and optional footer.
 */
export function AuthFormLayout({
  title,
  description,
  isBack,
  onBack,
  formContent,
  submitLabel,
  onSubmit,
  isSubmitting,
  isSubmitDisabled = false,
  footer,
  stepKey,
}: AuthFormLayoutProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="grid h-screen w-screen grid-cols-2 overflow-hidden p-4">
        <div className="rounded-large flex h-full items-center justify-center bg-black">
          <BlurIn>
            <Logo className="text-background" />
          </BlurIn>
        </div>
        <div className="mx-auto mt-2 flex w-full max-w-sm flex-col justify-start gap-4">
          <Header title={title} description={description} isBack={isBack} onBack={onBack} />
          <AnimatePresence custom={stepKey} initial={false} mode="wait">
            <m.form
              key={stepKey}
              animate="center"
              custom={stepKey}
              exit="exit"
              initial="enter"
              transition={{ duration: 0.25 }}
              variants={stepVariants}
              onSubmit={onSubmit}
              className="flex flex-col items-center gap-2"
            >
              {formContent}
              {submitLabel && (
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  variant="shadow"
                  radius="lg"
                  fullWidth
                  className="mt-4 py-6"
                  data-testid="auth-submit-btn"
                  isDisabled={isSubmitDisabled}
                >
                  {submitLabel}
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
      </div>
    </LazyMotion>
  );
}
