'use client';

import {
  projectsApi,
  type CreateProjectData,
  type UpdateProjectData,
} from '@/lib/api/projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const getProjectsKey = () => ['projects'];

export const useProjectsList = () => {
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getProjectsKey(),
    queryFn: () => projectsApi.fetch(),
    staleTime: 60000,
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: getProjectsKey() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: projectsApi.update,
    onSuccess: () => {
      toast.success('Project updated successfully');
      queryClient.invalidateQueries({ queryKey: getProjectsKey() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      toast.success('Project deleted successfully');
      queryClient.invalidateQueries({ queryKey: getProjectsKey() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });

  const createProject = async (data: CreateProjectData) => {
    try {
      const result = await createMutation.mutateAsync(data);
      return result.id;
    } catch {
      throw new Error('Failed to create project');
    }
  };

  const updateProject = async (id: string, data: Omit<UpdateProjectData, 'id'>) => {
    try {
      await updateMutation.mutateAsync({ ...data, id });
      return true;
    } catch {
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    projects,
    isLoading,
    error: error?.message || null,
    createProject,
    updateProject,
    deleteProject,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

