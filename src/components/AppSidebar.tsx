'use client';

import { Plus, Folder, ChevronDown, ChevronRight, HomeIcon } from 'lucide-react';

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
import { useState } from 'react';
import NewProjectDialog from './tasks/dialogs/NewProjectDialog';
import Link from 'next/link';
import { useProjects } from '@/hooks/use-projects';
import { getProjectCategory } from '@/app/api/projects/utils';
import LucidIcon from './utils/LucidIcon';

const AppSidebar = () => {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const { projects, submitProject } = useProjects();

  return (
    <Sidebar className="bg-black border-[1px] border-zinc-700 text-slate-200 z-20">
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
                              <span className="text-sm">{project.name}</span>
                            </div>
                            <span className="text-xs text-zinc-400">
                              {project._count.projectCards}
                            </span>
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
