import { Progress } from '@heroui/react';

import { BookQueueSteps } from './data';
import VerticalSteps, { VerticalCollapsibleStepProps } from './vertical-steps';

import { APP_INFO } from '@/libs/config';

export const CreateAppointmentSidebar = ({
  currentStep,
  steps = [],
  setCurrentStep,
}: {
  currentStep: BookQueueSteps;
  steps?: VerticalCollapsibleStepProps[];
  setCurrentStep: (step: BookQueueSteps) => void;
}) => {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  return (
    <section
      data-testid="create-appointment-sidebar"
      className="border-divider flex h-full w-full max-w-sm flex-col overflow-hidden border-r p-4"
    >
      <div>
        <h1 className="mb-2 text-xl font-medium" id="getting-started">
          {APP_INFO.name}
        </h1>
        <p className="text-default-500 text-small mb-5">{APP_INFO.description}</p>
      </div>
      <Progress
        classNames={{
          base: 'mb-4',
          label: 'text-small',
          value: 'text-small text-default-400',
        }}
        label="Steps"
        maxValue={steps.length - 1}
        minValue={0}
        showValueLabel={true}
        size="md"
        value={currentStepIndex}
        valueLabel={`${currentStepIndex + 1} of ${steps.length}`}
      />
      <VerticalSteps
        currentStep={currentStepIndex}
        steps={steps}
        onStepChange={(stepIndex) => {
          const step = steps[stepIndex];
          if (step) setCurrentStep(step.key);
        }}
      />
    </section>
  );
};
