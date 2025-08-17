import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getEventsByInstitution } from '../../services/apiFront';

export function useGetEventsByInstitution(id) {
  const query = useQuery({
    queryKey: ['events_by_institution', id], // cache per-institucija
    enabled: !!id, // ne pali bez ID-a
    queryFn: () => getEventsByInstitution(id), // PROSLIJEDI ID!
    onSuccess: () => toast.success('Događaji učitani'),
  });

  return {
    isLoading: query.isLoading,
    eventsByInstitution: query.data?.data, // tvoj payload
    error: query.error,
  };
}
