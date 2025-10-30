import ProjectBody from '@/components/project/ProjectBody';
import ProjectReferencesSection from '@/components/project/ProjectReferencesSection';

interface ProjectProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DynamicPage({ params }: ProjectProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-row">
      <ProjectBody projectId={id} />
      <ProjectReferencesSection projectId={id} />
    </div>
  );
}
