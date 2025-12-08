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

interface TaskHeaderProps {
  openSidebar?: () => void;
}

const TaskHeader = ({ openSidebar }: TaskHeaderProps) => {
  return (
    <div className="flex flex-row p-2 md:p-4 justify-end w-full bg-card border-b border-border shrink-0 gap-2 shadow-bot">
      <Menu openSidebar={openSidebar} />
    </div>
  );
};

export default TaskHeader;

const Menu = ({ openSidebar }: TaskHeaderProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-zinc-900 hover:bg-transparent group hover:border-zinc-500 p-2 border ">
          <GripVertical className="text-zinc-700 group-hover:text-zinc-500" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-background">
        <DropdownMenuItem>
          <Link
            href="/archives"
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
