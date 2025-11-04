import { ProjectCategory, ProjectCategoryKey } from '@/app/api/projects/types';
import { Axe, Printer, Brush, Box, Cog, LoaderPinwheel, Cpu, Camera } from 'lucide-react';

export const PROJECT_CATEGORIES: Readonly<Record<string, ProjectCategory>> = {
  other: {
    key: 'other',
    name: 'Other',
    description: 'other',
    color: '#64748b',
    icon: LoaderPinwheel,
  },
  wood: {
    key: 'craft',
    name: 'Craft',
    description: 'Crafting projects',
    color: '#8b5e3c',
    icon: Axe,
  },
  art: {
    key: 'art',
    name: 'Art',
    description: 'Painting, drawing, and creative arts',
    color: '#ca8a04',
    icon: Brush,
  },
  design: {
    key: 'design',
    name: '3D',
    description: '3D modeling, printing, and design',
    color: '#06b6d4',
    icon: Box,
  },
  photography: {
    key: 'photography',
    name: 'Photography',
    description: 'Photography projects',
    color: '#fde047',
    icon: Camera,
  },
  engineering: {
    key: 'engineering',
    name: 'Engineering',
    description: 'Electronics, mechanics, and engineering projects',
    color: '#a21caf',
    icon: Cog,
  },
  work: {
    key: 'work',
    name: 'Work',
    description: 'Professional and business projects',
    color: '#3b82f6',
    icon: Printer,
  },
  programming: {
    key: 'programming',
    name: 'Programming',
    description: 'Software development and coding',
    color: '#a3e635',
    icon: Cpu,
  },
} as const;

export const PROJECT_CATEGORY_KEYS = Object.keys(
  PROJECT_CATEGORIES,
) as ProjectCategoryKey[];
