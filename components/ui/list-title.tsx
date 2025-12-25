import React from 'react';

import { cn } from '@heroui/react';

interface ListTitleProps {
  className?: string;
  classNames?: {
    container?: string;
    title?: string;
    subtitle?: string;
  };
  button?: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}

export default function ListTitle(props: ListTitleProps) {
  return (
    <div className={cn('my-4 flex items-center justify-between', props.className)}>
      <div className="flex items-center gap-2">
        {props.icon}
        <h1>{props.title || 'Title'}</h1>
      </div>
      <div>{props.button}</div>
    </div>
  );
}
