'use client';

import { ProjectType, ProjectSelectType } from '@/app/api/projects/types';
import { useCallback, useEffect, useState } from 'react';

export const useProjectsList = () => {
  const [projects, setProjects] = useState<ProjectSelectType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error as string);
    }
  }, []);

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
      return true;
    } catch (error) {
      console.error('Failed to update project:', error);
      return false;
    }
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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    fetchProjects,
    error,
  };
};

