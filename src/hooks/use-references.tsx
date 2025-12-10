'use client';

import { ProjectReferencesType } from '@/app/api/projects/references/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useReferences = (projectId: string) => {
  const [references, setReferences] = useState<ProjectReferencesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/references?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setReferences(data || []);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch references');
        toast.error('Failed to fetch references');
      }
    } catch {
      setError('Failed to fetch references');
      toast.error('Failed to fetch references');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createReference = async (data: {
    name: string;
    description?: string;
    url?: string;
  }) => {
    try {
      const response = await fetch('/api/projects/references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error('Failed to create reference');
        return false;
      }

      toast.success('Reference created successfully');
      await fetchReferences();
      return true;
    } catch (error) {
      console.error('Error creating reference:', error);
      toast.error('Failed to create reference');
      return false;
    }
  };

  const updateReference = async (
    id: string,
    data: { name: string; description?: string; url?: string },
  ) => {
    try {
      const response = await fetch('/api/projects/references', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error('Failed to update reference');
        return false;
      }

      toast.success('Reference updated successfully');
      await fetchReferences();
      return true;
    } catch (error) {
      console.error('Error updating reference:', error);
      toast.error('Failed to update reference');
      return false;
    }
  };

  const deleteReference = async (id: string) => {
    try {
      const response = await fetch('/api/projects/references', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error('Failed to delete reference');
        return false;
      }

      toast.success('Reference deleted successfully');
      await fetchReferences();
      return true;
    } catch (error) {
      console.error('Error deleting reference:', error);
      toast.error('Failed to delete reference');
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchReferences();
    }
  }, [projectId, fetchReferences]);

  return {
    references,
    isLoading,
    error,
    createReference,
    updateReference,
    deleteReference,
    refetch: fetchReferences,
  };
};
