import { format, parseISO } from 'date-fns';

export function FormatDate({ value }: { value: string }) {
  const parsed = parseISO(value);
  return (
    <p className="text-default-foreground text-small text-nowrap capitalize">
      {format(parsed, 'dd MMM yyyy')}
    </p>
  );
}

export function FormatTime({ value }: { value: string }) {
  const parsed = parseISO(value);
  return (
    <p className="text-default-500 text-tiny text-nowrap capitalize">{format(parsed, 'HH:mm')}</p>
  );
}

export function FormatDateTime({ value }: { value: string }) {
  const parsed = parseISO(value);

  return (
    <div className="flex flex-col">
      <p className="text-default-foreground text-small text-nowrap capitalize">
        {format(parsed, 'dd MMM yyyy')}
      </p>
      <p className="text-default-500 text-tiny text-nowrap capitalize">{format(parsed, 'HH:mm')}</p>
    </div>
  );
}
