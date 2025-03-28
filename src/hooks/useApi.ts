'use client';

import { useState, useEffect } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  dependencies?: unknown[];
}

/**
 * Custom hook for fetching data from the API
 * @param fetchFn The function to fetch data
 * @param options Options for the hook
 * @returns An object with data, loading, and error states
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { initialData, dependencies = [] } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  
  return { data, loading, error };
}