import ProjectBody from '@/components/project/ProjectBody';
import ProjectReferencesSection from '@/components/project/ProjectReferencesSection';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

interface ProjectProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DynamicPage({ params }: ProjectProps) {
  const { id } = await params;

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-row">
      <ResizablePanelGroup direction="horizontal" className="w-full flex bg-dotted">
        <ResizablePanel minSize={60} defaultSize={80}>
          <ProjectBody projectId={id} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={15}>
          <div className="w-full md:h-dvh border-l border-borderColor md:flex flex-col gap-2 p-2 bg-background2 hidden">
            <ProjectReferencesSection projectId={id} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
