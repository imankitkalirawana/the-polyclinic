import { AppointmentType } from '@/services/client/appointment';

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

export type Weight = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type Type = 'bg' | 'text' | 'border';
const colors: Color[] = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
];

const weights: Weight[] = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const types: Type[] = ['bg', 'text', 'border'];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const randomColorClass = ({
  weight,
  color,
  type,
}: {
  weight?: Weight;
  color?: Color;
  type?: Type;
}): string => {
  const resolvedType = type ?? getRandom(types);
  const resolvedColor = color ?? getRandom(colors);
  const resolvedWeight = weight ?? getRandom(weights);

  const result = `${resolvedType}-${resolvedColor}-${resolvedWeight}`;
  return result;
};

export const getStatusColor = (status: AppointmentType['status']) => {
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
