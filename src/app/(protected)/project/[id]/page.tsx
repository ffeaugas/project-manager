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
          <ProjectBody
            projectId={id}
            referencesSlot={<ProjectReferencesSection projectId={id} />}
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel minSize={15} defaultSize={20} className="hidden md:block min-w-[200px]">
          <div className="w-full md:h-dvh border-l border-border md:flex flex-col gap-2 p-2 bg-card hidden">
            <ProjectReferencesSection projectId={id} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
