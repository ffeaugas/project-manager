import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LANDING_PAGE_CONTENT } from '@/const/landing-page-content';
import { cn } from '@/lib/utils';
import { FolderKanban, Calendar, FileText, Lightbulb, StickyNote } from 'lucide-react';

const featureIcons = [Lightbulb, FolderKanban, Calendar, FileText, StickyNote];

const FeatureCard = ({ index, className }: { index: number; className: string }) => {
  const data = LANDING_PAGE_CONTENT.features[index];
  const Icon = featureIcons[index] || Lightbulb;
  return (
    <Card
      key={index}
      className={cn('bg-primary border-2 md:shadow-hard shadow-2xl', className)}
    >
      <CardHeader className="flex flex-row items-center gap-4 xl:p-4 lg:p-3 p-2">
        <div className="flex w-12 h-12 rounded-lg bg-background/40 items-center justify-center">
          <Icon className="h-6 w-6 text-background" />
        </div>
        <CardTitle className="text-background text-left xl:text-xl lg:text-md">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="xl:text-md text-sm text-background text-left">
          {data.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
