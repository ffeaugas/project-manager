'use client';

import {
  projectCardsApi,
  type CreateProjectCardData,
  type UpdateProjectCardData,
} from '@/lib/api/projectCards';
import { ProjectCardType } from '@/app/api/projects/cards/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const getProjectDetailsKey = (projectId: string) => ['project-details', projectId];

export const useProjectDetails = (id: string) => {
  const queryClient = useQueryClient();

  const {
    data: project = null,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getProjectDetailsKey(id),
    queryFn: () => projectCardsApi.fetch(id),
    enabled: !!id,
    staleTime: 60000,
  });

  const createMutation = useMutation({
    mutationFn: projectCardsApi.create,
    onSuccess: () => {
      toast.success('Project card created successfully');
      queryClient.invalidateQueries({ queryKey: getProjectDetailsKey(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project card');
    },
  });

  const updateMutation = useMutation({
    mutationFn: projectCardsApi.update,
    onSuccess: () => {
      toast.success('Project card updated successfully');
      queryClient.invalidateQueries({ queryKey: getProjectDetailsKey(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update project card');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectCardsApi.delete,
    onSuccess: () => {
      toast.success('Project card deleted successfully');
      queryClient.invalidateQueries({ queryKey: getProjectDetailsKey(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete project card');
    },
  });

  const createProjectCard = async (bodyData: ProjectCardType) => {
    try {
      await createMutation.mutateAsync({
        ...bodyData,
        projectId: id,
      });
      return true;
    } catch {
      return false;
    }
  };

  const updateProjectCard = async (bodyData: ProjectCardType, cardId: string) => {
    try {
      await updateMutation.mutateAsync({
        id: cardId,
        ...bodyData,
      });
      return true;
    } catch {
      return false;
    }
  };

  const deleteProjectCard = async (cardId: string) => {
    try {
      await deleteMutation.mutateAsync(cardId);
      return true;
    } catch {
      return false;
    }
  };

  return {
    project,
    isLoading,
    error: error?.message || null,
    createProjectCard,
    updateProjectCard,
    deleteProjectCard,
    refetch,
    fetchProject: refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
