import { ProjectCategory } from '@/app/api/projects/types';
import { CalendarEventCategoryKey, ProjectCategoryKey } from '@prisma/client';
import { LucideIcon } from 'lucide-react';
import {
  Axe,
  Printer,
  Brush,
  Box,
  Cog,
  LoaderPinwheel,
  Cpu,
  Camera,
  ContactRound,
  Cake,
  AlertCircle,
  Theater,
} from 'lucide-react';

const COLOR_MAP: Readonly<Record<string, string>> = {
  orange: 'oklch(64.6% 0.222 41.116)',
  yellow: 'oklch(85.2% 0.199 91.936)',
  green: 'oklch(45.3% 0.124 130.933)',
  blueGreen: 'oklch(69.6% 0.17 162.48)',
  blue: 'oklch(71.5% 0.143 215.221)',
  darkBlue: 'oklch(48.8% 0.243 264.376)',
  purple: 'oklch(55.8% 0.288 302.321)',
  pink: 'oklch(71.8% 0.202 349.761)',
  red: 'oklch(51.4% 0.222 16.935)',
};

export const PROJECT_CATEGORY_KEYS: ProjectCategoryKey[] = [
  'other',
  'wood',
  'art',
  'design',
  'photography',
  'engineering',
  'work',
  'programming',
] as const;

export const PROJECT_CATEGORIES = {
  other: {
    key: 'other',
    name: 'Other',
    description: 'other',
    color: COLOR_MAP.blue,
    icon: LoaderPinwheel,
  },
  wood: {
    key: 'wood',
    name: 'Craft',
    description: 'Crafting projects',
    color: COLOR_MAP.orange,
    icon: Axe,
  },
  art: {
    key: 'art',
    name: 'Art',
    description: 'Painting, drawing, and creative arts',
    color: COLOR_MAP.blueGreen,
    icon: Brush,
  },
  design: {
    key: 'design',
    name: '3D',
    description: '3D modeling, printing, and design',
    color: COLOR_MAP.pink,
    icon: Box,
  },
  photography: {
    key: 'photography',
    name: 'Photography',
    description: 'Photography projects',
    color: COLOR_MAP.red,
    icon: Camera,
  },
  engineering: {
    key: 'engineering',
    name: 'Engineering',
    description: 'Electronics, mechanics, and engineering projects',
    color: COLOR_MAP.darkBlue,
    icon: Cog,
  },
  work: {
    key: 'work',
    name: 'Work',
    description: 'Professional and business projects',
    color: COLOR_MAP.green,
    icon: Printer,
  },
  programming: {
    key: 'programming',
    name: 'Programming',
    description: 'Software development and coding',
    color: COLOR_MAP.purple,
    icon: Cpu,
  },
} as const satisfies Record<ProjectCategoryKey, ProjectCategory>;

export const CALENDAR_EVENT_CATEGORIES = {
  default: {
    key: 'default',
    name: 'default',
    color: COLOR_MAP.blue,
    icon: LoaderPinwheel,
  },
  social: {
    key: 'social',
    name: 'social',
    color: COLOR_MAP.pink,
    icon: ContactRound,
  },
  work: {
    key: 'work',
    name: 'work',
    color: COLOR_MAP.green,
    icon: Printer,
  },
  birthday: {
    key: 'birthday',
    name: 'birthday',
    color: COLOR_MAP.yellow,
    icon: Cake,
  },
  important: {
    key: 'important',
    name: 'important',
    color: COLOR_MAP.orange,
    icon: AlertCircle,
  },
  culture: {
    key: 'culture',
    name: 'culture',
    color: COLOR_MAP.red,
    icon: Theater,
  },
} as const satisfies Record<CalendarEventCategoryKey, CalendarEventCategory>;

export type CalendarEventCategory = {
  key: CalendarEventCategoryKey;
  name: string;
  color: string;
  icon: LucideIcon;
};
