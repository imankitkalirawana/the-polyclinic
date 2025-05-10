import Image from 'next/image';
import { cn } from '@heroui/react';

import { APP_INFO } from '@/lib/config';

export default function Logo({ isCompact }: { isCompact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="logo" width={36} height={36} />
      <span
        className={cn('whitespace-nowrap text-xl font-semibold', {
          hidden: isCompact,
        })}
      >
        {/* {APP_INFO.name} */}
        Hello
      </span>
    </div>
  );
}
