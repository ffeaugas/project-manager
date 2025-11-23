'use client';

import { Plus, Folder, ChevronDown, ChevronRight, HomeIcon, SunIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { useState } from 'react';
import NewProjectDialog from './tasks/dialogs/NewProjectDialog';
import Link from 'next/link';
import { useProjects } from '@/hooks/use-projects';
import { getProjectCategory } from '@/app/api/projects/utils';
import LucidIcon from './utils/LucidIcon';
import { User } from 'better-auth';
import AuthButton from './auth/AuthButton';

const AppSidebar = ({ userData }: { userData: User }) => {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const { projects, submitProject } = useProjects();
  const pathname = usePathname();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  };

  return (
    <Sidebar
      collapsible="none"
      className="bg-background3 border border-borderColor text-foreground2"
    >
      <SidebarContent>
        <AuthButton userData={userData} />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.includes('/home')}>
                  <Link href="/home">
                    <HomeIcon />
                    <span>Home</span>
                  </Link>
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
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === `/project/${project.id}`}
                        >
                          <Link
                            href={`/project/${project.id}`}
                            className="flex items-center gap-2 justify-between w-full"
                          >
                            <div className="flex items-center gap-2">
                              {(() => {
                                const category = getProjectCategory(project.category);
                                return (
                                  <LucidIcon
                                    icon={category.icon}
                                    size={16}
                                    color={category.color}
                                  />
                                );
                              })()}
                              <span className="text-sm">
                                {project.name.length > 18
                                  ? project.name.slice(0, 18) + '...'
                                  : project.name}
                              </span>
                            </div>
                            <span className="text-xs text-zinc-400">
                              {project._count.projectCards}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    <NewProjectDialog submitProject={submitProject}>
                      <Button
                        variant="outline"
                        className="flex flex-row items-center justify-center mt-2"
                      >
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
        <SidebarFooter>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <SunIcon />
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
