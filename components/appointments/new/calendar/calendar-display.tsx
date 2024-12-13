'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from '@react-aria/i18n';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export const CalendarDisplay = ({ date = new Date() }: { date?: Date }) => {
  const [index, setIndex] = useState(0);
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const slotParam = searchParams.get('slot');
  const time = new Date(slotParam as string).toLocaleString(locale, {
    timeStyle: 'short'
  });

  // Detect changes in date prop and trigger animation
  useEffect(() => {
    setIndex((prev) => prev + 1); // Trigger animation by changing index
  }, [date]); // Runs whenever `date` changes

  return (
    <div className="w-fit overflow-hidden rounded-xl border-2 border-primary bg-primary">
      <div className="flex items-center justify-between px-1.5 py-0.5 text-white">
        <span className="text-center uppercase">{format(date, 'LLLL')}</span>
        <span>{slotParam && time}</span>
      </div>
      <div className="relative z-0 h-36 w-52 shrink-0">
        <AnimatePresence mode="sync">
          {/* Animate first layer */}
          <motion.div
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
              zIndex: -index,
              backfaceVisibility: 'hidden'
            }}
            key={`${index}-front`}
            transition={{
              duration: 0.75,
              ease: 'easeInOut'
            }}
            initial={{ rotateX: '0deg' }}
            animate={{ rotateX: '0deg' }}
            exit={{ rotateX: '-180deg' }}
            className="absolute inset-0"
          >
            <div className="relative grid h-full w-full place-content-center rounded-lg bg-background text-6xl">
              <span>{format(date, 'do')}</span>
              <span className="absolute left-1/2 top-5 -translate-x-1/2 text-sm">
                {format(date, 'eeee')}
              </span>
            </div>
          </motion.div>

          {/* Animate second layer */}
          <motion.div
            style={{
              clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
              zIndex: index,
              backfaceVisibility: 'hidden'
            }}
            key={`${index}-back`}
            initial={{ rotateX: '180deg' }}
            animate={{ rotateX: '0deg' }}
            exit={{ rotateX: '0deg' }}
            transition={{
              duration: 0.75,
              ease: 'easeInOut'
            }}
            className="absolute inset-0"
          >
            <div className="relative grid h-full w-full place-content-center rounded-lg bg-background text-6xl">
              {format(date, 'do')}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">
                {format(date, 'yyyy')}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
