import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ILucidIconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  className?: string;
}

const LucidIcon = ({ icon, size = 16, color = 'white', className }: ILucidIconProps) => {
  return (
    <>
      {(() => {
        const Icon = icon;
        return <Icon size={size} className={cn(className)} color={color} />;
      })()}
    </>
  );
};

export default LucidIcon;
