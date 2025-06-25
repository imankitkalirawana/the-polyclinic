import CreateAppointment from '@/components/appointments/create';

export default function CreateAppointmentPage() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
      <CreateAppointment selectedDate={new Date()} />
    </div>
  );
}
