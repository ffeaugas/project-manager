import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Archive, GripVertical, PanelsTopLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../common/Header';
import { ReactNode } from 'react';

interface TaskHeaderProps {
  openSidebar?: () => void;
  breadcrumbs?: ReactNode;
}

const TaskHeader = ({ openSidebar, breadcrumbs }: TaskHeaderProps) => {
  return (
    <Header>
      {breadcrumbs && <div className="flex items-center">{breadcrumbs}</div>}
      <div className="flex items-center">
        <Menu openSidebar={openSidebar} />
      </div>
    </Header>
  );
};

export default TaskHeader;

const Menu = ({ openSidebar }: TaskHeaderProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-2">
          <GripVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-background">
        <DropdownMenuItem>
          <Link
            href="/home/archives"
            className="flex flex-row justify-between w-full items-center"
          >
            <span>See archives</span>
            <Archive size={16} />
          </Link>
        </DropdownMenuItem>
        {openSidebar && (
          <>
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem
              className="md:hidden flex justify-between items-center cursor-pointer"
              onSelect={openSidebar}
            >
              <span>Dashboard</span>
              <PanelsTopLeft size={16} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
