import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateLocation as updateLocationAPI } from '../../services/apiLocations'; // Your axios service

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateLocation,
  } = useMutation({
    mutationFn: updateLocationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateLocation };
}
