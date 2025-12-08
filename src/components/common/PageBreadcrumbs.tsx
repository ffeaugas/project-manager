import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { HomeIcon, Calendar, Archive } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

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
                <BreadcrumbPage className="flex items-center gap-2">
                  {Icon && <Icon size={16} />}
                  <span>{item.label}</span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href || '#'} className="flex items-center gap-2">
                    {Icon && <Icon size={16} />}
                    <span>{item.label}</span>
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
