import { Progress } from '@heroui/react';

import { useCreateAppointment } from './content';
import { steps } from './data';
import { useAppointmentDate } from './hooks';
import VerticalSteps from './vertical-steps';

import { APP_INFO } from '@/lib/config';

export const CreateAppointmentSidebar = () => {
  const { currentStep, setCurrentStep } = useAppointmentDate();
  const { values } = useCreateAppointment();

  return (
    <section className="flex h-full max-w-sm flex-col border-r border-divider p-4">
      <div>
        <h1 className="mb-2 text-xl font-medium" id="getting-started">
          {APP_INFO.name}
        </h1>
        <p className="mb-5 text-small text-default-500">{APP_INFO.description}</p>
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
