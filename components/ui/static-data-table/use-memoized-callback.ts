import { useMemo, useRef } from 'react';

import type { $FixMe } from '@/types';

type noop = (this: $FixMe, ...args: $FixMe[]) => $FixMe;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

export function useMemoizedCallback<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo<T>(() => fn, [fn]);

  const memoizedFn = useRef<PickFunction<T>>(undefined);

  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
}
