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
      <ResizablePanelGroup 
        direction="horizontal" 
        className="w-full flex bg-dotted"
        id={`project-${id}-resizable-group`}
      >
        <ResizablePanel minSize={60} defaultSize={80} id={`project-${id}-main-panel`}>
          <ProjectBody
            projectId={id}
            referencesSlot={<ProjectReferencesSection projectId={id} />}
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" id={`project-${id}-resize-handle`} />
        <ResizablePanel minSize={15} defaultSize={20} className="hidden md:block min-w-[200px]" id={`project-${id}-side-panel`}>
          <div className="w-full md:h-dvh border-l border-border md:flex flex-col gap-2 p-2 bg-card hidden">
            <ProjectReferencesSection projectId={id} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
