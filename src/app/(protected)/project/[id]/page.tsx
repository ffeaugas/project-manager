import ProjectBody from '@/components/project/ProjectBody';
import TaskBody from '@/components/tasks/TaskBody';

interface ProjectProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DynamicPage({ params }: ProjectProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <ProjectBody projectId={id} />
    </div>
  );
}
