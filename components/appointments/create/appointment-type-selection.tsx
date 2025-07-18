import { useState, useMemo } from 'react';
import CustomRadio from '@/components/ui/custom-radio';
import { castData } from '@/lib/utils';
import { useAllAppointments } from '@/services/appointment';
import { AppointmentType, appointmentTypes } from '@/types/appointment';
import { Button, Input, RadioGroup, ScrollShadow } from '@heroui/react';

export default function AppointmentTypeSelection({
  appointmentType,
  previousAppointment,
  setAppointmentType,
  setPreviousAppointment,
  onContinue,
}: {
  appointmentType: AppointmentType['type'];
  previousAppointment?: AppointmentType['aid'];
  setAppointmentType: (type: AppointmentType['type']) => void;
  setPreviousAppointment?: (aid?: AppointmentType['aid']) => void;
  onContinue: () => void;
}) {
  const { data } = useAllAppointments();
  const [search, setSearch] = useState('');

  const appointments = castData<AppointmentType[]>(data) || [];

  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        appointment.aid.toString().includes(search)
    );
  }, [appointments, search]);

  const isContinueDisabled =
    (appointmentType === 'follow-up' && !previousAppointment) ||
    !appointmentType;

  return (
    <div>
      <RadioGroup
        orientation="horizontal"
        value={appointmentType}
        onValueChange={(value) => {
          setAppointmentType(value as AppointmentType['type']);
          setPreviousAppointment?.(undefined);
        }}
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
      {appointmentType === 'follow-up' && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm text-default-500">Previous Appointments</h3>
          {appointments.length > 0 ? (
            <>
              <Input
                placeholder="Search for an appointment"
                radius="lg"
                className="max-w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredAppointments.length > 0 ? (
                <RadioGroup
                  as={ScrollShadow}
                  orientation="horizontal"
                  value={previousAppointment?.toString()}
                  onValueChange={(value) =>
                    setPreviousAppointment?.(parseInt(value))
                  }
                >
                  {filteredAppointments.map((appointment) => (
                    <CustomRadio
                      key={appointment.aid}
                      value={appointment.aid.toString()}
                      className="rounded-medium p-2"
                      description={`${appointment.patient.name} - ${appointment.doctor?.name}`}
                    >
                      #{appointment.aid}
                    </CustomRadio>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-default-500">
                  No appointments found for {search}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-default-500">
              No previous appointments found
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="shadow"
          color="primary"
          radius="lg"
          className="btn btn-primary"
          onPress={onContinue}
          isDisabled={isContinueDisabled}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export const AppointmentTypeSelectionTitle = ({
  appointmentType,
  previousAppointment,
}: {
  appointmentType: AppointmentType['type'];
  previousAppointment?: AppointmentType['aid'];
}) => {
  return (
    <h3 className="text-2xl font-semibold">
      {appointmentType
        ? appointmentTypes.find((type) => type.value === appointmentType)?.label
        : 'Choose an appointment type'}
      {previousAppointment && <span> for #{previousAppointment}</span>}
    </h3>
  );
};
