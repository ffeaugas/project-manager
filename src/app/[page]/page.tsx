import TaskBody from '@/components/tasks/TaskBody';

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { page } = await params;

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <TaskBody page={page} />
    </div>
  );
}
