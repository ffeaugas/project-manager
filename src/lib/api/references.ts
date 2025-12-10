import { ProjectReferencesType } from '@/app/api/projects/references/types';

export type CreateReferenceData = {
  name: string;
  description?: string;
  url?: string;
  projectId: string;
};

export type UpdateReferenceData = {
  id: string;
  name: string;
  description?: string;
  url?: string;
};

export const referencesApi = {
  async fetch(projectId: string): Promise<ProjectReferencesType[]> {
    const response = await fetch(`/api/projects/references?projectId=${projectId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch references');
    }

    const data = await response.json();
    return data || [];
  },

  async create(data: CreateReferenceData) {
    const response = await fetch('/api/projects/references', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create reference');
    }

    return response.json();
  },

  async update(data: UpdateReferenceData) {
    const response = await fetch('/api/projects/references', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update reference');
    }

    return response.json();
  },

  async delete(id: string) {
    const response = await fetch('/api/projects/references', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete reference');
    }

    return response.json();
  },
};
