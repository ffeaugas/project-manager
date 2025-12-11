import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { LucideIcon } from 'lucide-react';
import LucidIcon from '../utils/LucidIcon';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const PageBreadcrumbs = ({ items }: PageBreadcrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.flatMap((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;
          const elements = [
            <BreadcrumbItem key={index}>
              {isLast ? (
                <BreadcrumbPage className="flex items-center gap-4">
                  {Icon && (
                    <LucidIcon
                      icon={Icon}
                      size={40}
                      className="border border-border rounded-sm p-2 lg:block hidden"
                    />
                  )}
                  <span className="text-xs md:text-lg font-semibold">{item.label}</span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href || '#'} className="flex items-center gap-4">
                    {Icon && (
                      <LucidIcon icon={Icon} size={16} className="lg:block hidden" />
                    )}
                    <span className="text-xs md:text-lg font-semibold">{item.label}</span>
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>,
          ];

          if (!isLast) {
            elements.push(<BreadcrumbSeparator key={`separator-${index}`} />);
          }

          return elements;
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
