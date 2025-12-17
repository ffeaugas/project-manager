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
      className={cn('bg-primary absolute shadow-hard border-2 w-90', className)}
    >
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <div className="flex w-12 h-12 rounded-lg bg-background/40 items-center justify-center">
          <Icon className="h-6 w-6 text-background" />
        </div>
        <CardTitle className="text-background text-left text-xl">{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-md text-background text-left">
          {data.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
