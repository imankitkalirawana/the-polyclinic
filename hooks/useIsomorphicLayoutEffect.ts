import { useEffect, useLayoutEffect } from 'react';

/**
 * A hook that uses `useLayoutEffect` on the client and
 * falls back to `useEffect` during server-side rendering (SSR).
 *
 * Prevents React warnings when rendering on the server,
 * while still allowing synchronous DOM updates on the client.
 *
 * ```ts
 * useIsomorphicLayoutEffect(() => {
 *   // safe DOM reads/writes on client and SSR
 * }, []);
 * ```
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
