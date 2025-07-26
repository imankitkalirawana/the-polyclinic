import { Button } from '@heroui/react';
import { m } from 'framer-motion';

export function Header({
  title,
  description,
  isBack,
  onBack,
}: {
  title: string;
  description?: string;
  isBack?: boolean;
  onBack?: () => void;
}) {
  return (
    <m.div layout className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {isBack && (
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => onBack?.()}
            aria-label="Go back"
          >
            <span className="sr-only">Go back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-default-500"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        )}
        <m.h1 layout className="text-xl font-medium" transition={{ duration: 0.25 }}>
          {title}
        </m.h1>
      </div>
      {description && (
        <m.p layout className="text-small text-default-500" transition={{ duration: 0.25 }}>
          {description}
        </m.p>
      )}
    </m.div>
  );
}
