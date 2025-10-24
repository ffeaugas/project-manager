export function parseFormData(formData: FormData) {
  return {
    id: formData.get('id') as string | null,
    name: formData.get('name') as string | null,
    description: formData.get('description') as string | null,
    projectId: formData.get('projectId') as string | null,
    imageFile: formData.get('image') as File | null,
  };
}

export function toUpdateData(data: {
  id: string;
  name: string | null;
  description: string | null;
  projectId: string | null;
}) {
  return {
    id: parseInt(data.id),
    name: data.name || undefined,
    description: data.description || undefined,
    projectId: data.projectId ? parseInt(data.projectId) : undefined,
  };
}
