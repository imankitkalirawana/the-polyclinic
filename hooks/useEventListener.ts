import React, { useEffect, useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

import { $FixMe } from '@/types';

/**
 * A React hook for adding event listeners to DOM elements or the window object.
 *
 * Forked from React Haiku's `useEventListener` implementation.
 * Source: https://github.com/DavidHDev/haiku/blob/main/lib/hooks/useEventListener.ts
 *
 * Features:
 * - Works in both client and SSR environments using `useIsomorphicLayoutEffect`.
 * - Automatically cleans up the event listener on unmount or dependency change.
 * - Supports listening to events on `window` or a passed `ref` element.
 */

export function useEventListener(
  eventName: string,
  handler: (e: Event) => $FixMe,
  element?: React.RefObject<$FixMe>
) {
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element?.current || window;

    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const eventListener = (event: Event) => savedHandler.current(event);
    targetElement.addEventListener(eventName, eventListener);

    // eslint-disable-next-line consistent-return
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
