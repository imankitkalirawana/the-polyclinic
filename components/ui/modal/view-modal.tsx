import { PatientType } from '@/services/client/patient';
import { CellRenderer } from '@/components/ui/cell/rich-color/cell-renderer';

const ViewPatientBody = ({ patient }: { patient: PatientType }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CellRenderer
        label="Name"
        value={patient.name}
        icon="solar:user-bold-duotone"
        classNames={{
          icon: 'text-blue-500 bg-blue-100',
        }}
      />

      {(patient.gender || patient.age) && (
        <CellRenderer
          icon="solar:user-bold-duotone"
          value={[
            patient.gender || patient.age
              ? [patient.gender, patient.age].filter(Boolean).join(', ')
              : '',
          ]}
          classNames={{
            icon: 'text-default-500 ',
            value: 'text-default-foreground',
          }}
          iconSize={18}
        />
      )}
      <CellRenderer
        label="Phone Number"
        value={patient.phone}
        icon="solar:phone-bold-duotone"
        classNames={{ icon: 'text-green-500 bg-green-100' }}
      />

      <CellRenderer
        label="Email"
        value={patient.email}
        icon="solar:letter-bold-duotone"
        classNames={{ icon: 'text-blue-500 bg-blue-100' }}
      />

      {patient.address && (
        <CellRenderer
          label="Address"
          value={patient.address}
          icon="solar:hospital-bold-duotone"
          classNames={{ icon: 'text-blue-500 bg-blue-50' }}
        />
      )}
    </div>
  );
};

export default ViewPatientBody;
