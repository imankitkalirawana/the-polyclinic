import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AnimatePresence, m } from 'framer-motion';

// Animation variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};

export const RegisterHeader = ({
  title,
  description,
  isBack,
  onBack,
}: {
  title: string;
  description?: string;
  isBack?: boolean;
  onBack?: () => void;
}) => {
  return (
    <m.div layout className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {isBack && (
          <m.div>
            <Tooltip content="Go back" delay={3000}>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => onBack?.()}
              >
                <Icon
                  className="text-default-500"
                  icon="solar:alt-arrow-left-linear"
                  width={16}
                />
              </Button>
            </Tooltip>
          </m.div>
        )}
        <m.h1
          layout
          className="text-xl font-medium"
          transition={{ duration: 0.25 }}
        >
          {title}
        </m.h1>
      </div>
      {description && (
        <m.p
          layout
          className="text-sm text-default-500"
          transition={{ duration: 0.25 }}
        >
          {description}
        </m.p>
      )}
    </m.div>
  );
};
