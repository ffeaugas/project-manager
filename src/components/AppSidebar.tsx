'use client';

/* eslint-disable @typescript-eslint/no-unused-vars*/
import {
  Brush,
  Home,
  Box,
  Cat,
  Eclipse,
  Frown,
  Heart,
  Star,
  Layers,
  WandSparkles,
  Citrus,
  AlarmClock,
  Cherry,
  Drum,
  Plus,
  LucideIcon,
  Folder,
  ChevronDown,
  ChevronRight,
  HomeIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import NewProjectDialog from './tasks/dialogs/NewProjectDialog';
import Link from 'next/link';
import AuthStatus from './auth/Header';
import { User } from 'better-auth';
import { Spinner } from './ui/spinner';
import { toast } from 'sonner';
import { useProjects } from '@/hooks/use-projects';

interface SidebarItem {
  name: string;
  id: number;
}

// Icon mapping function
const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    brush: Brush,
    home: Home,
    box: Box,
    cat: Cat,
    eclipse: Eclipse,
    frown: Frown,
    heart: Heart,
    star: Star,
    layers: Layers,
    wandsparkles: WandSparkles,
    citrus: Citrus,
    alarmclock: AlarmClock,
    cherry: Cherry,
    drum: Drum,
  };

  return iconMap[iconName.toLowerCase()] || Home;
};

const AppSidebar = ({ user }: { user: User | undefined }) => {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const { projects, isLoading, error, submitProject } = useProjects();

  if (!user) {
    toast.error('Problem logging in');
    return <Spinner />;
  }

  return (
    <Sidebar className="bg-zinc-900 border-[1px] border-zinc-700 text-slate-200">
      {/* <SidebarTrigger className="absolute -right-10 top-4 z-50" /> */}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/home">
                    <HomeIcon />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setProjectsExpanded(!projectsExpanded)}
                  className="cursor-pointer"
                >
                  <Folder />
                  <span>Projects</span>
                  {projectsExpanded ? (
                    <ChevronDown className="ml-auto" size={16} />
                  ) : (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                </SidebarMenuButton>

                {projectsExpanded && (
                  <SidebarMenuSub>
                    {projects.map((project) => (
                      <SidebarMenuSubItem key={project.name}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/project/${project.id}`}>
                            <Home />
                            <span>{project.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    <NewProjectDialog submitProject={submitProject}>
                      <Button className="mt-4 w-full bg-zinc-700 hover:bg-zinc-600 text-slate-200">
                        <Plus size={16} className="mr-2" />
                        New Project
                      </Button>
                    </NewProjectDialog>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
