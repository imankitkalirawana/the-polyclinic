import { useEffect, useMemo, useRef } from 'react';
import { $FixMe } from '@/types';

const normalizeKey = (key: string) => {
  return key.toLowerCase();
};

export function useKeyPress(
  keys: string[],
  callback: (e: KeyboardEvent) => void,
  options: { capture?: boolean; preventDefault?: boolean } = {}
) {
  const lastKeyPressed = useRef<Set<string>>(new Set([]));
  const keysSet = useMemo(() => {
    return new Set(keys.map((key) => normalizeKey(key)));
  }, [keys]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return; // To prevent this function from triggering on key hold e.g. Ctrl hold

    // Ignore keyboard shortcuts when user is typing in input fields
    const target = e.target as HTMLElement;
    const isTyping =
      target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if (isTyping) return;

    lastKeyPressed.current?.add(normalizeKey(e.key));

    // To bypass TypeScript check for the new ECMAScript method `isSubsetOf`
    if ((keysSet as $FixMe).isSubsetOf(lastKeyPressed.current)) {
      if (options.preventDefault !== false) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      callback(e);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    lastKeyPressed.current?.delete(normalizeKey(e.key));
  };

  const handleBlur = () => {
    lastKeyPressed.current?.clear();
  };

  useEffect(() => {
    const capture = options.capture !== false; // Default to true

    window.addEventListener('keydown', handleKeyDown, { capture });
    window.addEventListener('keyup', handleKeyUp, { capture });
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture });
      window.removeEventListener('keyup', handleKeyUp, { capture });
      window.removeEventListener('blur-sm', handleBlur);
    };
  }, [keysSet, callback, options.capture, options.preventDefault]);
}
