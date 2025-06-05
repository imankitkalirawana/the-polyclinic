import { auth } from '@/auth';
import { randomColorClass } from '@/lib/tailwind';

export default async function Dashboard() {
  const session = await auth();

  return (
    <div
      className={randomColorClass({ weight: '500', color: 'red', type: 'bg' })}
    >
      Hello World
    </div>
  );
}
