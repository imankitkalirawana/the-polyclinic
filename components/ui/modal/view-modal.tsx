import { PatientType } from '@/services/client/patient';

const Field = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string | number | null | undefined;
  fullWidth?: boolean;
}) => {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="mb-1 text-xs text-default-500">{label}</p>
      <div className="flex h-10 items-center rounded-lg bg-default-100 px-3 text-sm font-medium">
        {value || '—'}
      </div>
    </div>
  );
};

const ViewPatientBody = ({ patient }: { patient: PatientType }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Name" value={patient.name} />
      <Field label="Gender" value={patient.gender} />

      <Field label="Age" value={patient.age} />
      <Field label="Phone Number" value={patient.phone} />

      <Field label="Email" value={patient.email} fullWidth />

      {patient.address && <Field label="Address" value={patient.address} fullWidth />}
    </div>
  );
};

export default ViewPatientBody;
