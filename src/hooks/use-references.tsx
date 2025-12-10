'use client';

import {
  referencesApi,
  type CreateReferenceData,
  type UpdateReferenceData,
} from '@/lib/api/references';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const getReferencesKey = (projectId: string) => ['references', projectId];

export const useReferences = (projectId: string) => {
  const queryClient = useQueryClient();

  const {
    data: references = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getReferencesKey(projectId),
    queryFn: () => referencesApi.fetch(projectId),
    enabled: !!projectId,
    staleTime: 60000,
  });

  const createMutation = useMutation({
    mutationFn: referencesApi.create,
    onSuccess: () => {
      toast.success('Reference created successfully');
      queryClient.invalidateQueries({ queryKey: getReferencesKey(projectId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create reference');
    },
  });

  const updateMutation = useMutation({
    mutationFn: referencesApi.update,
    onSuccess: () => {
      toast.success('Reference updated successfully');
      queryClient.invalidateQueries({ queryKey: getReferencesKey(projectId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update reference');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: referencesApi.delete,
    onSuccess: () => {
      toast.success('Reference deleted successfully');
      queryClient.invalidateQueries({ queryKey: getReferencesKey(projectId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete reference');
    },
  });

  const createReference = async (data: Omit<CreateReferenceData, 'projectId'>) => {
    try {
      await createMutation.mutateAsync({ ...data, projectId });
      return true;
    } catch {
      return false;
    }
  };

  const updateReference = async (id: string, data: Omit<UpdateReferenceData, 'id'>) => {
    try {
      await updateMutation.mutateAsync({ ...data, id });
      return true;
    } catch {
      return false;
    }
  };

  const deleteReference = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    references,
    isLoading,
    error: error?.message || null,
    createReference,
    updateReference,
    deleteReference,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
