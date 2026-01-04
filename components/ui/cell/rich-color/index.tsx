import { format } from 'date-fns';
import { CellRenderer } from './cell-renderer';

export type ValueTypes =
  | 'key'
  | 'name'
  | 'email'
  | 'phone'
  | 'age'
  | 'gender'
  | 'status'
  | 'date'
  | 'datetime'
  | 'time'
  | 'text';

export interface RichColorCellProps {
  type: ValueTypes;
  label?: string;
  value?: string | number | undefined;
}

const CELL_CONFIG: Record<
  ValueTypes,
  {
    icon: string;
    label: string;
    iconClass: string;
    format?: (value: string | number) => string;
  }
> = {
  key: {
    icon: 'solar:key-minimalistic-bold-duotone',
    label: 'ID',
    iconClass: 'text-pink-500 bg-pink-100',
  },
  name: {
    icon: 'solar:user-bold-duotone',
    label: 'Name',
    iconClass: 'text-blue-500 bg-blue-100',
  },
  email: {
    icon: 'solar:letter-bold-duotone',
    label: 'Email',
    iconClass: 'text-purple-500 bg-purple-100',
  },
  phone: {
    icon: 'solar:phone-bold-duotone',
    label: 'Phone',
    iconClass: 'text-green-500 bg-green-100',
  },
  age: {
    icon: 'solar:hiking-minimalistic-broken',
    label: 'Age',
    iconClass: 'text-red-500 bg-red-100',
    format: (v) => `${v} ${v === 1 ? 'year' : 'years'}`,
  },
  gender: {
    icon: 'solar:men-bold-duotone',
    label: 'Gender',
    iconClass: 'text-cyan-500 bg-cyan-100',
    format: (v) => String(v).toLowerCase(),
  },
  status: {
    icon: 'solar:check-circle-bold-duotone',
    label: 'Status',
    iconClass: 'text-emerald-500 bg-emerald-100',
  },
  date: {
    icon: 'solar:calendar-bold-duotone',
    label: 'Date',
    iconClass: 'text-indigo-500 bg-indigo-100',
    format: (v) => format(new Date(v), 'dd MMM yyyy'),
  },
  time: {
    icon: 'solar:clock-circle-bold-duotone',
    label: 'Time',
    iconClass: 'text-orange-500 bg-orange-100',
    format: (v) => format(new Date(v), 'hh:mm a'),
  },
  datetime: {
    icon: 'solar:clock-circle-bold-duotone',
    label: 'Date & Time',
    iconClass: 'text-indigo-500 bg-indigo-100',
    format: (v) => format(new Date(v), 'PPp'),
  },
  text: {
    icon: 'solar:list-down-minimalistic-linear',
    label: 'Text',
    iconClass: 'text-gray-500 bg-gray-100',
  },
};

export default function RichColorCell({ type, label, value }: RichColorCellProps) {
  if (value === undefined || value === null) return null;

  const config = CELL_CONFIG[type];

  return (
    <CellRenderer
      icon={config.icon}
      label={label ?? config.label}
      value={config.format ? config.format(value) : value}
      classNames={{
        icon: config.iconClass,
      }}
    />
  );
}
