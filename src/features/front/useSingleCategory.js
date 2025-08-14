import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSingleCategory } from '../../services/apiFront';

const ZERO_GUID = '00000000-0000-0000-0000-000000000000';

export function useGetSingleCategory(id, options = {}) {
  const isValidId = !!id && id !== ZERO_GUID;
  const {
    retry = 3,
    retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 3000),
    refetchOnWindowFocus = false,
    enabled = true,
    suppressToast = false, // custom opcija da ne spamamo toastove u tabeli
    ...rest
  } = options;

  const {
    isLoading,
    data: singleCategory,
    error,
  } = useQuery({
    queryKey: ['singleCategory', id],
    queryFn: () => getSingleCategory(id),
    retry,
    retryDelay,
    refetchOnWindowFocus,
    enabled: isValidId && enabled,
    ...rest,
  });

  useEffect(() => {
    if (error && !suppressToast) {
      toast.error(`${error.message}`);
    }
  }, [error, suppressToast]);

  return { isLoading, singleCategory, error };
}
