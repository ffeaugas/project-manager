'use client';

import {
  Plus,
  Folder,
  ChevronDown,
  ChevronRight,
  HomeIcon,
  SunIcon,
  Moon,
} from 'lucide-react';
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
import { useState, useEffect } from 'react';
import CreateProjectDialog from './project/dialogs/CreateProjectDialog';
import Link from 'next/link';
import { useProjectsList } from '@/hooks/use-projects-list';
import { getProjectCategory } from '@/app/api/projects/utils';
import LucidIcon from './utils/LucidIcon';
import { User } from 'better-auth';
import AuthButton from './auth/AuthButton';
import { ProjectSelectType } from '@/app/api/projects/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from 'next-themes';

const AppSidebar = ({ userData }: { userData: User }) => {
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const { projects, createProject } = useProjectsList();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar
      collapsible={isMobile ? 'offcanvas' : 'none'}
      className="border border-border w-[300px]"
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
                      <ProjectItem
                        key={project.id}
                        project={project}
                        pathname={pathname}
                      />
                    ))}
                    <CreateProjectDialog onSubmit={createProject}>
                      <Button
                        variant="dashed"
                        className="flex flex-row items-center justify-center mt-2 border-secondary font-semibold"
                      >
                        <Plus size={16} className="mr-2" />
                        New Project
                      </Button>
                    </CreateProjectDialog>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          suppressHydrationWarning
        >
          {mounted && resolvedTheme === 'dark' ? <SunIcon /> : <Moon />}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

interface IProjectItemProps {
  project: ProjectSelectType;
  pathname: string;
}

const ProjectItem = ({ project, pathname }: IProjectItemProps) => {
  return (
    <SidebarMenuSubItem key={project.name}>
      <SidebarMenuSubButton asChild isActive={pathname === `/project/${project.id}`}>
        <Link
          href={`/project/${project.id}`}
          className="flex items-center gap-2 justify-between w-full"
        >
          <div className="flex items-center gap-2">
            {(() => {
              const category = getProjectCategory(project.category);
              return <LucidIcon icon={category.icon} size={16} color={category.color} />;
            })()}
            <span className="text-sm">
              {project.name.length > 18
                ? project.name.slice(0, 18) + '...'
                : project.name}
            </span>
          </div>
          <span className="text-xs text-zinc-400">{project._count.projectCards}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};
