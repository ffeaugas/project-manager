'use client';

import {
  NewProjectCardType,
  ProjectSelect,
  ProjectWithUrls,
} from '@/components/project/types';
import { useEffect, useState } from 'react';

export const useProjects = (id?: string) => {
  const [projects, setProjects] = useState<ProjectSelect[]>([]);
  const [project, setProject] = useState<ProjectWithUrls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submitProjectCard = async (
    bodyData: NewProjectCardType,
    options?: { projectCardId?: number; projectId?: number },
  ) => {
    const formData = new FormData();
    formData.append('name', bodyData.name);
    formData.append('description', bodyData.description);

    if (options?.projectId) {
      formData.append('projectId', options.projectId.toString());
    }

    if (bodyData.image) {
      formData.append('image', bodyData.image);
    }

    const method = options?.projectCardId ? 'PATCH' : 'POST';
    if (options?.projectCardId) {
      formData.append('id', options.projectCardId.toString());
    }

    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
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

  const deleteProjectCard = async (id: number) => {
    const response = await fetch(`/api/projects/cards`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error('Failed to delete project card');
    await fetchProject();
    return true;
  };

  const submitProject = async (
    bodyData: { name: string; description: string },
    projectId?: number,
  ) => {
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

  const fetchProject = async () => {
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
  };

  const fetchProjects = async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
    if (id) {
      fetchProject();
    }
  }, [id]);

  return {
    project,
    projects,
    isLoading,
    submitProjectCard,
    deleteProjectCard,
    submitProject,
    error,
  };
};
