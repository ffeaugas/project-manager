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
      className={cn('bg-primary absolute shadow-2xl border-2 border-white', className)}
    >
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-background/40 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-background" />
        </div>
        <CardTitle className="text-background">{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-background">
          {data.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
