import CustomRadio from '@/components/ui/custom-radio';
import { useAllAppointments } from '@/services/appointment';
import { AppointmentType, appointmentTypes } from '@/types/appointment';
import { Button, RadioGroup } from '@heroui/react';

export default function AppointmentTypeSelection({
  appointmentType,
  setAppointmentType,
  onContinue,
}: {
  appointmentType: AppointmentType['type'];
  setAppointmentType: (type: AppointmentType['type']) => void;
  onContinue: () => void;
}) {
  const { data } = useAllAppointments();

  return (
    <div>
      <RadioGroup
        orientation="horizontal"
        value={appointmentType}
        onValueChange={(value) =>
          setAppointmentType(value as AppointmentType['type'])
        }
      >
        {appointmentTypes.map((type) => (
          <CustomRadio
            key={type.value}
            value={type.value}
            description={type.description}
          >
            {type.label}
          </CustomRadio>
        ))}
      </RadioGroup>
      {appointmentType === 'follow-up' && <div>Hello</div>}

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
