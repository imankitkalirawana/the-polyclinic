import { cn } from '@heroui/react';

export default function Logo({ isCompact }: { isCompact?: boolean }) {
  return (
    <h2 className="group flex items-center pl-4 text-2xl font-bold">
      <div className="relative text-primary transition-all group-hover:text-primary-400">
        <div className="absolute -left-[14px] top-1/2 flex -translate-y-1/2 flex-col items-end justify-end gap-[1px]">
          <span className="block h-[5px] w-4 translate-x-[4px] rounded-l-lg rounded-tr-none border-b-1 border-background bg-current"></span>
          <span className="block h-[4px] w-4 rounded-l-lg bg-current"></span>
          <span className="block h-[5px] w-4 translate-x-[3.3px] rounded-l-lg rounded-tr-none border-t-1 border-background bg-current"></span>
        </div>
        <span>Go</span>
      </div>
      <span className={cn({ hidden: isCompact })}>Mapper</span>
    </h2>
  );
}
