'use client';

import { NewProjectType, ProjectSelectType } from '@/app/api/projects/types';
import { NewProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import { useCallback, useEffect, useState } from 'react';

export const useProjects = (id?: string) => {
  const [projects, setProjects] = useState<ProjectSelectType[]>([]);
  const [project, setProject] = useState<ProjectWithUrls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submitProjectCard = async (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: string; projectId?: string },
  ) => {
    const formData = new FormData();
    const name = bodyData.name?.trim();
    const description = bodyData.description?.trim();
    if (name) {
      formData.append('name', name);
    }
    if (description) {
      formData.append('description', description);
    }
    formData.append('description', bodyData.description || '');

    if (options?.projectId) {
      formData.append('projectId', options.projectId);
    }

    if (bodyData.image) {
      formData.append('image', bodyData.image);
    }

    const method = options?.projectCardId ? 'PATCH' : 'POST';
    if (options?.projectCardId) {
      formData.append('id', options.projectCardId);
    }

    const response = await fetch(`/api/projects/cards`, {
      method,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error('Failed to create project card');
    }
    await fetchProject();
    return true;
  };

  const deleteProjectCard = async (id: string) => {
    const response = await fetch(`/api/projects/cards`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error('Failed to delete project card');
    await fetchProject();
    return true;
  };

  const deleteProject = async (id: string) => {
    const response = await fetch(`/api/projects`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('Failed to delete project');
    await fetchProjects();
    return true;
  };

  const submitProject = async (bodyData: NewProjectType, projectId?: string) => {
    try {
      const requestBody = projectId ? { ...bodyData, id: projectId } : bodyData;
      const response = await fetch('/api/projects', {
        method: projectId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const data = await response.json();
      await fetchProjects();
      return data.id;
    } catch (e) {
      console.error('Error creating project:', e);
      throw e;
    }
  };

  const fetchProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/cards?projectId=${id}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchProjects = useCallback(async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    setProjects(data);
  }, []);

  useEffect(() => {
    fetchProjects();
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject, fetchProjects]);

  return {
    project,
    projects,
    isLoading,
    submitProjectCard,
    deleteProjectCard,
    deleteProject,
    submitProject,
    error,
  };
};
