import * as React from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    const item = localStorage.getItem(key);

    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }

    setValue(item ? JSON.parse(item) : defaultValue);

    function handler(e: StorageEvent) {
      if (e.key !== key) return;

      const lsi = localStorage.getItem(key);

      setValue(JSON.parse(lsi ?? ''));
    }

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  const setValueWrap = (valueOrFn: T | ((prevValue: T) => T)) => {
    try {
      const newValue =
        valueOrFn instanceof Function ? valueOrFn(value) : valueOrFn;

      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', { key }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return [value, setValueWrap];
}
