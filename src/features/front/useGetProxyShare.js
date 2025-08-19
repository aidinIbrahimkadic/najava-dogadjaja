import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProxyShare } from '../../services/apiFront';

export function useGetProxyShare(id) {
  const {
    isLoading,
    data: proxyShare,
    error,
  } = useQuery({
    queryKey: ['proxyShare', id],
    queryFn: () => getProxyShare(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`proxyShare učitan`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, proxyShare, error };
}
