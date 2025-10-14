'use client';

import { NewProjectCardType, ProjectCardSelect } from '@/components/project/types';
import { useEffect, useState } from 'react';

export const useProjects = (id: string) => {
  const [project, setProject] = useState<ProjectCardSelect[]>([]);

  const submitProjectCard = async (bodyData: NewProjectCardType) => {
    const response = await fetch(`/api/projects/cards`, {
      method: 'POST',
      body: JSON.stringify(bodyData),
    });
    if (!response.ok) throw new Error('Failed to create project card');
    await fetchProjectCards();
    return true;
  };

  const deleteProjectCard = async (id: number) => {
    const response = await fetch(`/api/projects/cards/${id}`, {
      method: 'DELETE',
    });
  };

  const fetchProjectCards = async () => {
    const response = await fetch(`/api/projects/`);
    const data = await response.json();
    setProject(data);
  };

  useEffect(() => {
    fetchProjectCards();
  }, [id]);

  return {
    project,
    submitProjectCard,
    deleteProjectCard,
  };
};
