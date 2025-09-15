// import { useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { getAllInstitutions } from '../../services/apiFront';

// export function useGetAllInstitutions() {
//   const { isLoading, data, error } = useQuery({
//     queryKey: ['public_institutions'],
//     queryFn: getAllInstitutions,
//     onSuccess: () => {
//       toast.success(`Institucije učitane`);
//     },
//   });
//   useEffect(() => {
//     if (error) {
//       toast.error(`${error.message}`);
//     }
//   }, [error]);

//   const allInstitutions = data?.data;

//   return { isLoading, allInstitutions, error };
// }

// features/front/useAllInstitutions.js
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllInstitutions as apiGetAll } from '../../services/apiFront';

function normalizeToList(res) {
  // pokrij najčešće oblike: res, res.data, res.data.data, res.items, res.result ...
  if (Array.isArray(res)) return res;
  const d = res?.data ?? res;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.result)) return d.result;
  return [];
}

export function useGetAllInstitutions({ defer = 'idle', toastOnSuccess = false } = {}) {
  const [enabled, setEnabled] = useState(() => defer === false);

  // Defer fetch-a da ne blokira prvi paint
  useEffect(() => {
    if (defer === false) {
      setEnabled(true);
      return;
    }

    if (defer === 'paint') {
      const id = setTimeout(() => setEnabled(true), 0);
      return () => clearTimeout(id);
    }

    if (defer === 'idle' && typeof window !== 'undefined') {
      const start = () => setEnabled(true);
      if ('requestIdleCallback' in window) {
        const h = window.requestIdleCallback(start, { timeout: 1500 });
        return () => window.cancelIdleCallback && window.cancelIdleCallback(h);
      }
      const id = setTimeout(start, 200); // fallback
      return () => clearTimeout(id);
    }

    if (typeof defer === 'number') {
      const id = setTimeout(() => setEnabled(true), defer);
      return () => clearTimeout(id);
    }

    // default
    setEnabled(true);
  }, [defer]);

  const { data, isFetching, error, isSuccess } = useQuery({
    queryKey: ['public_institutions'],
    queryFn: async () => {
      const res = await apiGetAll();
      return normalizeToList(res);
    },
    enabled,
    // ne koristimo initialData da ne “zamaskiramo” bug,
    // ali vraćamo [] prema UI-u (vidi return ispod)
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    onSuccess: () => {
      if (toastOnSuccess) toast.success('Institucije učitane');
    },
  });

  useEffect(() => {
    if (error) toast.error(String(error?.message ?? 'Greška pri dobavljanju institucija'));
  }, [error]);

  // UI uvijek dobija niz (nikad undefined), pa ništa ne čeka
  const allInstitutions = Array.isArray(data) ? data : [];
  const isLoading = isFetching && !isSuccess && allInstitutions.length === 0;

  return { isLoading, allInstitutions, error };
}
