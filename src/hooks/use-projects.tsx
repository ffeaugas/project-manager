'use client';

import { NewProjectCardType, ProjectCardSelect } from '@/components/project/types';
import { useEffect, useState } from 'react';

export const useProjects = (id: string) => {
  const [project, setProject] = useState<ProjectCardSelect[]>([]);

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

  const fetchProject = async () => {
    const response = await fetch(`/api/projects/cards`);
    const data = await response.json();
    setProject(data);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  return {
    project,
    submitProjectCard,
    deleteProjectCard,
  };
};
