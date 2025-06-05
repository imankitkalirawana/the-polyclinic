export type Color =
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

export type Weight =
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

const weights: Weight[] = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];

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
  console.log(result);
  return result;
};
