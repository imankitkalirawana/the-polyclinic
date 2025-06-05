import { randomColorClass } from '@/lib/tailwind';
import { cn } from '@heroui/react';

export default function Dashboard() {
  return (
    <div className={cn(randomColorClass({ color: 'red', type: 'text' }))}>
      Hello World
    </div>
  );
}
