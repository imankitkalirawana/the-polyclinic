'use client';

import { Button, RadioGroup } from '@heroui/react';

import CustomRadio from '@/components/ui/custom-radio';

const selectionOptions = [
  {
    label: "I don't know my doctor",
    value: 'dont-know-your-doctor',
    description: 'You have to choose an appointment date and we will assign a doctor to you',
  },
  {
    label: 'I know my doctor',
    value: 'know-your-doctor',
    description: 'I know my doctor and want to book an appointment with them',
  },
];

export default function DoYouKnowDoctorSelection({
  knowYourDoctor,
  onSelectionChange,
  onContinue,
}: {
  knowYourDoctor?: boolean;
  onSelectionChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <RadioGroup
        orientation="horizontal"
        value={knowYourDoctor ? selectionOptions[1].value : selectionOptions[0].value}
        onValueChange={(value) => {
          onSelectionChange(value);
        }}
      >
        {selectionOptions.map((option) => (
          <CustomRadio
            className="max-w-max flex-1"
            key={option.label}
            value={option.value}
            description={option.description}
          >
            {option.label}
          </CustomRadio>
        ))}
      </RadioGroup>
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="shadow"
          color="primary"
          radius="lg"
          className="btn btn-primary"
          onPress={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
