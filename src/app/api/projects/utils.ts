import { PROJECT_CATEGORIES } from '@/const/categories';
import { ProjectCategory, ProjectCategoryKey } from './types';

export function getProjectCategory(key?: string): ProjectCategory {
  if (!key) return PROJECT_CATEGORIES.other;
  const k = key as ProjectCategoryKey;
  return PROJECT_CATEGORIES[k] ?? PROJECT_CATEGORIES.other;
}
