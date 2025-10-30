import { ProjectCategory, ProjectCategoryKey } from '@/app/api/projects/types';
import {
  Axe,
  Wrench,
  Hammer,
  Trees,
  Rocket,
  Brush,
  Box,
  Cog,
  Folder,
  Tags,
} from 'lucide-react';

export const PROJECT_CATEGORIES: Readonly<Record<ProjectCategoryKey, ProjectCategory>> = {
  other: {
    key: 'other',
    name: 'Other',
    description: 'Miscellaneous projects',
    color: '#64748b',
    icon: Tags,
  },
  wood: {
    key: 'wood',
    name: 'Wood project',
    description: 'Woodworking and carpentry',
    color: '#8b5e3c',
    icon: Axe,
  },
  diy: {
    key: 'diy',
    name: 'DIY',
    description: 'Do-it-yourself and repairs',
    color: '#ca8a04',
    icon: Wrench,
  },
  construction: {
    key: 'construction',
    name: 'Construction',
    description: 'Building and renovation',
    color: '#ef4444',
    icon: Hammer,
  },
  nature: {
    key: 'nature',
    name: 'Nature',
    description: 'Gardening and outdoor',
    color: '#16a34a',
    icon: Trees,
  },
  product: {
    key: 'product',
    name: 'Product',
    description: 'Launches and roadmaps',
    color: '#8b5cf6',
    icon: Rocket,
  },
  design: {
    key: 'design',
    name: 'Design',
    description: 'Branding and UI/UX',
    color: '#06b6d4',
    icon: Brush,
  },
  packaging: {
    key: 'packaging',
    name: 'Packaging',
    description: 'Boxes, labels and shipment',
    color: '#f59e0b',
    icon: Box,
  },
  engineering: {
    key: 'engineering',
    name: 'Engineering',
    description: 'Systems and mechanics',
    color: '#0ea5e9',
    icon: Cog,
  },
  files: {
    key: 'files',
    name: 'Files',
    description: 'Documents and knowledge',
    color: '#22c55e',
    icon: Folder,
  },
  labeled: {
    key: 'labeled',
    name: 'Labeled',
    description: 'Tagged and categorized',
    color: '#a3e635',
    icon: Tags,
  },
} as const;

export const PROJECT_CATEGORY_KEYS = Object.keys(
  PROJECT_CATEGORIES,
) as ProjectCategoryKey[];
