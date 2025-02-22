'use client';
import { useState, useEffect } from 'react';

type AsyncComponentProps<T> = {
  fetchData: () => Promise<T>; // Function to fetch data
  fallback?: React.ReactNode; // Fallback UI component (e.g., a loading skeleton)
  render: (data: T) => React.ReactNode; // Render function that takes fetched data and returns UI
};

const AsyncComponent = <T>({
  fetchData,
  fallback,
  render
}: AsyncComponentProps<T>) => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchData().then((result) => {
      if (isMounted) setData(result);
    });

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  return data ? render(data) : fallback || null;
};

export default AsyncComponent;
