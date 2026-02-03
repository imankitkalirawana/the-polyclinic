import { Progress } from '@heroui/react';

import { CREATE_APPOINTMENT_STEPS } from './data';
import VerticalSteps, { VerticalCollapsibleStepProps } from './vertical-steps';

import { APP_INFO } from '@/libs/config';

export const CreateAppointmentSidebar = ({
  currentStep,
  steps = CREATE_APPOINTMENT_STEPS,
  setCurrentStep,
}: {
  currentStep: number;
  steps?: VerticalCollapsibleStepProps[];
  setCurrentStep: (step: number) => void;
}) => {
  return (
    <section
      data-testid="create-appointment-sidebar"
      className="flex h-full w-full max-w-sm flex-col overflow-hidden border-r border-divider p-4"
    >
      <div>
        <h1 className="mb-2 text-xl font-medium" id="getting-started">
          {APP_INFO.name}
        </h1>
        <p className="mb-5 text-default-500 text-small">{APP_INFO.description}</p>
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
        value={currentStep}
        valueLabel={`${currentStep + 1} of ${steps.length}`}
      />
      <VerticalSteps currentStep={currentStep} steps={steps} onStepChange={setCurrentStep} />
    </section>
  );
};
