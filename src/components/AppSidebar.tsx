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
} from './ui/sidebar';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import NewProjectDialog from './tasks/dialogs/NewProjectDialog';

interface SidebarItem {
  name: string;
  url: string;
  icon: LucideIcon;
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
      const response = await fetch('/api/projects');
      const data = await response.json();

      const projectItems: SidebarItem[] = data.map(
        (project: { name: string; description: string }) => ({
          name: project.name,
          url: `/${project.name.toLowerCase().replace(/\s+/g, '-')}`,
          description: getIconComponent(project.description),
        }),
      );

      setProjects(projectItems);
    };

    fetchProjects();
  }, []);

  const onSuccess = (name: string, icon: string) => {
    const newProject: SidebarItem = {
      name: name,
      url: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: getIconComponent(icon),
    };
    setProjects([...projects, newProject]);
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-800 text-slate-200">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-200">FranciTask</SidebarGroupLabel>
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
                          <a href={`/project/${project.url}`}>
                            <Home />
                            <span>{project.name}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-zinc-800">
        <NewProjectDialog onSuccess={onSuccess}>
          <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-slate-200">
            <Plus size={16} className="mr-2" />
            New Projet
          </Button>
        </NewProjectDialog>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
