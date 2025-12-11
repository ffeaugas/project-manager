import { ProjectWithCardsType, ProjectCardType, UpdateProjectCardType } from '@/app/api/projects/cards/types';

export type CreateProjectCardData = Omit<ProjectCardType, 'projectId'> & {
  projectId: string;
};

export type UpdateProjectCardData = UpdateProjectCardType;

export const projectCardsApi = {
  async fetch(projectId: string): Promise<ProjectWithCardsType> {
    const response = await fetch(`/api/projects/cards?projectId=${projectId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch project with cards');
    }

    const data = await response.json();
    return data;
  },

  async create(data: CreateProjectCardData) {
    const formData = new FormData();

    formData.append('name', data.name?.trim() || '');
    formData.append('description', data.description.trim() || '');
    formData.append('projectId', data.projectId);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await fetch('/api/projects/cards', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create project card');
    }

    return response.json();
  },

  async update(data: UpdateProjectCardData) {
    const formData = new FormData();

    formData.append('id', data.id);
    formData.append('name', data.name?.trim() || '');
    formData.append('description', data.description.trim() || '');
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await fetch('/api/projects/cards', {
      method: 'PATCH',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update project card');
    }

    return response.json();
  },

  async delete(id: string) {
    const response = await fetch('/api/projects/cards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete project card');
    }

    return response.json();
  },
};

