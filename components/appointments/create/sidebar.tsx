import { Progress } from '@heroui/react';

import { steps } from './data';
import { CreateAppointmentFormValues } from './types';
import VerticalSteps from './vertical-steps';

import { useSharedFormik } from '@/hooks/useSharedFormik';
import { APP_INFO } from '@/lib/config';

export const CreateAppointmentSidebar = () => {
  const formik = useSharedFormik<CreateAppointmentFormValues>();

  const { meta } = formik.values;
  const { currentStep } = meta;

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
      <VerticalSteps
        currentStep={currentStep}
        steps={steps}
        onStepChange={(step) => formik.setFieldValue('meta.currentStep', step)}
      />
    </section>
  );
};
