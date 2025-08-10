'use client';

import React from 'react';
import type { ButtonProps } from '@heroui/react';
import { ScrollShadow, Spacer } from '@heroui/react';
import { cn } from '@heroui/react';
import { domAnimation, LazyMotion, m } from 'framer-motion';
import type { ComponentProps } from 'react';
import { useControlledState } from '@react-stately/utils';

export type VerticalCollapsibleStepProps = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  details?: string[];
};

export interface VerticalCollapsibleStepsProps extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * An array of steps.
   *
   * @default []
   */
  steps?: VerticalCollapsibleStepProps[];
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
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
          duration: 0.3,
        }}
      />
    </svg>
  );
}

const VerticalCollapsibleSteps = React.forwardRef<HTMLButtonElement, VerticalCollapsibleStepsProps>(
  (
    {
      color = 'primary',
      steps = [],
      defaultStep = 0,
      onStepChange,
      currentStep: currentStepProp,
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
        '[--active-color:hsl(var(--step-color))]',
        '[--complete-background-color:hsl(var(--step-color))]',
        '[--complete-border-color:hsl(var(--step-color))]',
        '[--inactive-border-color:hsl(var(--heroui-default-300))]',
        '[--inactive-color:hsl(var(--heroui-default-300))]',
      ];

      switch (color) {
        case 'primary':
          userColor = '[--step-color:var(--heroui-primary)]';
          fgColor = '[--step-fg-color:var(--heroui-primary-foreground)]';
          break;
        case 'secondary':
          userColor = '[--step-color:var(--heroui-secondary)]';
          fgColor = '[--step-fg-color:var(--heroui-secondary-foreground)]';
          break;
        case 'success':
          userColor = '[--step-color:var(--heroui-success)]';
          fgColor = '[--step-fg-color:var(--heroui-success-foreground)]';
          break;
        case 'warning':
          userColor = '[--step-color:var(--heroui-warning)]';
          fgColor = '[--step-fg-color:var(--heroui-warning-foreground)]';
          break;
        case 'danger':
          userColor = '[--step-color:var(--heroui-error)]';
          fgColor = '[--step-fg-color:var(--heroui-error-foreground)]';
          break;
        case 'default':
          userColor = '[--step-color:var(--heroui-default)]';
          fgColor = '[--step-fg-color:var(--heroui-default-foreground)]';
          break;
        default:
          userColor = '[--step-color:var(--heroui-primary)]';
          fgColor = '[--step-fg-color:var(--heroui-primary-foreground)]';
          break;
      }

      colorsVars.unshift(fgColor);
      colorsVars.unshift(userColor);

      return colorsVars;
    }, [color]);

    return (
      <nav aria-label="Progress">
        <ScrollShadow
          hideScrollBar
          as="ol"
          className={cn('flex flex-col gap-y-3 overflow-y-scroll pb-4', colors, className)}
        >
          {steps?.map((step, stepIdx) => {
            let status =
              currentStep === stepIdx ? 'active' : currentStep < stepIdx ? 'inactive' : 'complete';

            return (
              <li
                key={stepIdx}
                className={cn(
                  'group relative gap-4 rounded-large border border-default-200 data-[status=active]:bg-default-100 dark:border-default-50 dark:data-[status=active]:bg-default-50',
                  stepClassName
                )}
                data-status={status}
              >
                <div className="flex w-full max-w-full items-center">
                  <button
                    key={stepIdx}
                    ref={ref}
                    title={
                      status === 'complete'
                        ? 'Step completed'
                        : status === 'inactive'
                          ? 'Complete the previous step first'
                          : 'Go to step'
                    }
                    aria-current={status === 'active' ? 'step' : undefined}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-center gap-x-4 rounded-large px-3 py-2.5',
                      {
                        'cursor-not-allowed': status !== 'complete',
                      }
                    )}
                    onClick={() => {
                      if (status === 'complete') {
                        setCurrentStep(stepIdx);
                      }
                    }}
                    {...props}
                  >
                    <div className="flex h-full items-center">
                      <LazyMotion features={domAnimation}>
                        <m.div animate={status} className="relative">
                          <m.div
                            className={cn(
                              'relative flex h-[34px] w-[34px] items-center justify-center rounded-full border-medium text-large font-semibold text-default-foreground',
                              {
                                'shadow-lg': status === 'complete',
                              }
                            )}
                            initial={false}
                            transition={{ duration: 0.25 }}
                            variants={{
                              inactive: {
                                backgroundColor: 'transparent',
                                borderColor: 'var(--inactive-border-color)',
                                color: 'var(--inactive-color)',
                              },
                              active: {
                                backgroundColor: 'transparent',
                                borderColor: 'var(--active-border-color)',
                                color: 'var(--active-color)',
                              },
                              complete: {
                                backgroundColor: 'var(--complete-background-color)',
                                borderColor: 'var(--complete-border-color)',
                              },
                            }}
                          >
                            <div className="flex items-center justify-center">
                              {status === 'complete' ? (
                                <CheckIcon className="h-6 w-6 text-[var(--active-fg-color)]" />
                              ) : (
                                <span>{stepIdx + 1}</span>
                              )}
                            </div>
                          </m.div>
                        </m.div>
                      </LazyMotion>
                    </div>
                    <div className="flex-1 text-left">
                      <div>
                        <div
                          className={cn(
                            'text-medium font-medium text-default-foreground transition-[color,opacity] duration-300 group-active:opacity-80',
                            {
                              'text-default-500': status === 'inactive',
                            }
                          )}
                        >
                          {step.title}
                        </div>
                        <div
                          className={cn(
                            'text-tiny text-default-600 transition-[color,opacity] duration-300 group-active:opacity-80 lg:text-small',
                            {
                              'text-default-500': status === 'inactive',
                            }
                          )}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                {step.details && step.details?.length > 0 && (
                  <LazyMotion features={domAnimation}>
                    <m.div
                      key={stepIdx}
                      animate={status}
                      className="flex"
                      exit="complete"
                      initial={false}
                      transition={{
                        opacity: {
                          duration: 0.25,
                        },
                        height: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        },
                      }}
                      variants={{
                        active: { opacity: 1, height: 'auto' },
                        inactive: { opacity: 0, height: 0 },
                        complete: { opacity: 0, height: 0 },
                      }}
                    >
                      <Spacer x={14} />
                      <ul className="list-disc pb-4 pl-1 pr-12 text-default-400">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="mb-1 text-tiny">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </m.div>
                  </LazyMotion>
                )}
              </li>
            );
          })}
        </ScrollShadow>
      </nav>
    );
  }
);

VerticalCollapsibleSteps.displayName = 'VerticalCollapsibleSteps';

export default VerticalCollapsibleSteps;
