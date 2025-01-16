'use client';

import type { ComponentProps } from 'react';
import type { ButtonProps } from '@nextui-org/react';

import React from 'react';
import { useControlledState } from '@react-stately/utils';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { cn, Tooltip } from '@nextui-org/react';

export type HorizontalStepProps = {
  title?: React.ReactNode;
  className?: string;
};

export interface HorizontalStepsProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * An array of steps.
   *
   * @default []
   */
  steps?: HorizontalStepProps[];
  /**
   * The color of the steps.
   *
   * @default "primary"
   */
  color?: ButtonProps['color'];
  /**
   * The current step index.
   */
  currentStep?: number;
  /**
   * The default step index.
   *
   * @default 0
   */
  defaultStep?: number;
  /**
   * Whether to hide the progress bars.
   *
   * @default false
   */
  hideProgressBars?: boolean;
  /**
   * The custom class for the steps wrapper.
   */
  className?: string;
  /**
   * The custom class for the step.
   */
  stepClassName?: string;
  /**
   * Callback function when the step index changes.
   */
  onStepChange?: (stepIndex: number) => void;
}

function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.2,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3
        }}
      />
    </svg>
  );
}

const HorizontalSteps = React.forwardRef<
  HTMLButtonElement,
  HorizontalStepsProps
>(
  (
    {
      color = 'primary',
      steps = [],
      defaultStep = 0,
      onStepChange,
      currentStep: currentStepProp,
      hideProgressBars = false,
      stepClassName,
      className,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = useControlledState(
      currentStepProp,
      defaultStep,
      onStepChange
    );

    const colors = React.useMemo(() => {
      let userColor;
      let fgColor;

      const colorsVars = [
        '[--active-fg-color:hsl(var(--step-fg-color))]',
        '[--active-border-color:hsl(var(--step-color))]',
        '[--active-color:hsl(var(--nextui-primary-300))]',
        '[--complete-background-color:hsl(var(--step-color))]',
        '[--complete-border-color:hsl(var(--step-color))]',
        '[--inactive-border-color:hsl(var(--nextui-default-300))]',
        '[--inactive-color:hsl(var(--nextui-default-300))]'
      ];

      switch (color) {
        case 'primary':
          userColor = '[--step-color:var(--nextui-primary)]';
          fgColor = '[--step-fg-color:var(--nextui-primary-foreground)]';
          break;
        case 'secondary':
          userColor = '[--step-color:var(--nextui-secondary)]';
          fgColor = '[--step-fg-color:var(--nextui-secondary-foreground)]';
          break;
        case 'success':
          userColor = '[--step-color:var(--nextui-success)]';
          fgColor = '[--step-fg-color:var(--nextui-success-foreground)]';
          break;
        case 'warning':
          userColor = '[--step-color:var(--nextui-warning)]';
          fgColor = '[--step-fg-color:var(--nextui-warning-foreground)]';
          break;
        case 'danger':
          userColor = '[--step-color:var(--nextui-error)]';
          fgColor = '[--step-fg-color:var(--nextui-error-foreground)]';
          break;
        case 'default':
          userColor = '[--step-color:var(--nextui-default)]';
          fgColor = '[--step-fg-color:var(--nextui-default-foreground)]';
          break;
        default:
          userColor = '[--step-color:var(--nextui-primary)]';
          fgColor = '[--step-fg-color:var(--nextui-primary-foreground)]';
          break;
      }

      colorsVars.unshift(fgColor);
      colorsVars.unshift(userColor);

      return colorsVars;
    }, [color]);

    return (
      <nav aria-label="Progress" className="max-w-fit overflow-x-auto">
        <ol
          className={cn(
            'flex flex-row flex-nowrap items-start gap-1',
            colors,
            className
          )}
        >
          {steps?.map((step, stepIdx) => {
            let status =
              currentStep === stepIdx
                ? 'active'
                : currentStep < stepIdx
                  ? 'inactive'
                  : 'complete';

            return (
              <li
                key={stepIdx}
                className="relative flex w-full max-w-[120px] items-center"
              >
                <Tooltip content={step.title} delay={1000}>
                  <button
                    key={stepIdx}
                    ref={ref}
                    aria-current={status === 'active' ? 'step' : undefined}
                    className={cn(
                      'group flex w-full cursor-pointer flex-col items-center justify-center gap-y-2 rounded-large py-2.5',
                      stepClassName
                    )}
                    onClick={() => setCurrentStep(stepIdx)}
                    {...props}
                  >
                    <div className="relative flex h-full items-center gap-2">
                      <LazyMotion features={domAnimation}>
                        <m.div animate={status} className="relative">
                          <m.div
                            className={cn(
                              'relative flex h-[4px] w-[56px] items-center justify-center rounded-full bg-default text-large font-semibold text-default-foreground',
                              {
                                'shadow-lg': status === 'complete'
                              }
                            )}
                            initial={false}
                            transition={{ duration: 0.25 }}
                            variants={{
                              inactive: {
                                backgroundColor: 'var(--inactive-color)',
                                borderColor: 'var(--inactive-border-color)',
                                color: 'var(--inactive-color)'
                              },
                              active: {
                                backgroundColor: 'var(--active-color)',
                                borderColor: 'var(--active-border-color)',
                                color: 'var(--active-color)'
                              },
                              complete: {
                                backgroundColor:
                                  'var(--complete-background-color)',
                                borderColor: 'var(--complete-border-color)'
                              }
                            }}
                          ></m.div>
                        </m.div>
                      </LazyMotion>
                    </div>
                  </button>
                </Tooltip>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

HorizontalSteps.displayName = 'HorizontalSteps';

export default HorizontalSteps;
