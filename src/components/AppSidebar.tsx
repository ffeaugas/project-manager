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
  CheckSquare,
  Folder,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from './ui/sidebar';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import NewProjectDialog from './tasks/dialogs/NewProjectDialog';
import Link from 'next/link';

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

const AppSidebar = () => {
  const [projects, setProjects] = useState<SidebarItem[]>([]);
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-800 text-slate-200">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-200">FranciTask</SidebarGroupLabel>
          <SidebarMenuSubItem key={'signup'}>
            <SidebarMenuSubButton asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarSeparator className="bg-zinc-700 my-2" />

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/todo">
                    <CheckSquare />
                    <span>Todo</span>
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
                    <NewProjectDialog>
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
      <SidebarFooter className="bg-zinc-800"></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
