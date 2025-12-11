import { Project, ProjectType, UpdateProjectType } from '@/app/api/projects/types';

export type CreateProjectData = ProjectType;

export type UpdateProjectData = UpdateProjectType;

export const projectsApi = {
  async fetch(): Promise<Project[]> {
    const response = await fetch('/api/projects');

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data = await response.json();
    return data || [];
  },

  async create(data: CreateProjectData) {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create project');
    }

    return response.json();
  },

  async update(data: UpdateProjectData) {
    const response = await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update project');
    }

    return response.json();
  },

  async delete(id: string) {
    const response = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete project');
    }

    return response.json();
  },
};
