'use client';

import { ProjectType, ProjectSelectType } from '@/app/api/projects/types';
import { ProjectCardType, ProjectWithUrls } from '@/app/api/projects/cards/types';
import { useCallback, useEffect, useState } from 'react';

export const useProjects = (id?: string) => {
  const [projects, setProjects] = useState<ProjectSelectType[]>([]);
  const [project, setProject] = useState<ProjectWithUrls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createProjectCard = async (bodyData: ProjectCardType) => {
    const formData = new FormData();

    formData.append('name', bodyData.name?.trim() || '');
    formData.append('description', bodyData.description?.trim() || '');
    formData.append('projectId', id || '');
    if (bodyData.image) {
      formData.append('image', bodyData.image);
    }

    try {
      const response = await fetch('/api/projects/cards', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return false;
      }

      await fetchProject();
      return true;
    } catch (error) {
      console.error('Failed to create project card:', error);
      return false;
    }
  };

  const updateProjectCard = async (bodyData: ProjectCardType, id: string) => {
    const formData = new FormData();

    formData.append('id', id);
    formData.append('name', bodyData.name?.trim() || '');
    formData.append('description', bodyData.description?.trim() || '');
    if (bodyData.image) {
      formData.append('image', bodyData.image);
    }

    try {
      const response = await fetch('/api/projects/cards', {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return false;
      }

      await fetchProject();
      return true;
    } catch (error) {
      console.error('Failed to update project card:', error);
      return false;
    }
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

  const createProject = async (bodyData: ProjectType) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
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

  const updateProject = async (bodyData: ProjectType, id: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bodyData, id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return false;
      }
      await fetchProjects();
      if (id) {
        await fetchProject();
      }
      return true;
    } catch (error) {
      console.error('Failed to update project:', error);
      return false;
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
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error as string);
    }
  }, [setError]);

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
    createProjectCard,
    updateProjectCard,
    deleteProjectCard,
    deleteProject,
    createProject,
    updateProject,
    error,
  };
};
