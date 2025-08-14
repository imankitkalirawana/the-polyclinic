import { useCallback, useEffect, useRef, useState } from 'react';

import { useEventListener } from './useEventListener';

import { $FixMe } from '@/types';

/**
 * A React hook to manage state synced with localStorage.
 *
 * Forked from React Haiku's `useLocalStorage` implementation.
 * Source: https://github.com/DavidHDev/haiku/blob/main/lib/hooks/useLocalStorage.ts
 *
 * Features:
 * - Works in both client and SSR environments.
 * - Handles JSON parsing/stringifying internally.
 * - Syncs state across tabs and components using storage events.
 */

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      return item ? parseJSON(item) : initialValue;
    } catch (error) {
      console.error(`Error getting storage key “${key}”:`, error);

      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState(readValue);
  const setValueRef = useRef<$FixMe>(null);

  setValueRef.current = (value: T) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));

      setStoredValue(newValue);
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error adding "${key}" to storage:`, error);
    }
  };

  const setValue = useCallback((value: T) => setValueRef.current?.(value), []);

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  const handleStorageChange = useCallback(() => setStoredValue(readValue()), [readValue]);
  useEventListener('storage', handleStorageChange);
  useEventListener('local-storage', handleStorageChange);
  return [storedValue, setValue];
}

function parseJSON(value: $FixMe) {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '');
  } catch {
    return undefined;
  }
}
