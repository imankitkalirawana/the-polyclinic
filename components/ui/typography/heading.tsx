import React from 'react';

import { cn } from '@heroui/react';

interface HeadingProps {
  className?: string;
  classNames?: {
    container?: string;
    title?: string;
    subtitle?: string;
  };
  button?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode | string;
}

export default function Heading(props: HeadingProps) {
  return (
    <div className={cn('my-4 flex items-center justify-between', props.className)}>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold sm:text-3xl">{props.title || 'Title'}</h1>
        <p className="text-default-500 text-small">{props.subtitle}</p>
      </div>
      <div>{props.button}</div>
    </div>
  );
}
