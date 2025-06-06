import { AppointmentStatus } from '@/models/Appointment';

type Color =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone';

type Weight =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

type Type = 'bg' | 'text' | 'border';

export const randomColorClass = ({
  weight,
  color,
  type,
}: {
  weight: Weight;
  color: Color;
  type: Type;
}) => {
  return `${type}-${color}-${weight}`;
};

export const getStatusColor = (status: AppointmentStatus) => {
  switch (status.toLowerCase()) {
    case 'booked':
      return 'text-blue-600 bg-blue-50';
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    case 'completed':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};
