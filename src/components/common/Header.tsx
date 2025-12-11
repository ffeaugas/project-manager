import { ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

const Header = ({ children, className = '' }: HeaderProps) => {
  return (
    <div
      className={`flex flex-row p-2 md:p-4 md:pl-4 pl-14 justify-between items-center w-full bg-card border-b border-border shrink-0 gap-2 shadow-bot ${className}`}
    >
      {children}
    </div>
  );
};

export default Header;
