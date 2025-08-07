export default function CreateAppointmentContentHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="text-3xl font-bold leading-9 text-default-foreground">{title}</div>
      <div className="text-center leading-5 text-default-500">{description}</div>
    </div>
  );
}
