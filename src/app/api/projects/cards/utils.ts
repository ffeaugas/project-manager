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
  id: string | null;
  name: string | null;
  description: string | null;
  projectId: string | null;
}): {
  id: string | undefined;
  name: string | undefined;
  description: string | undefined;
  projectId: string | undefined;
} {
  return {
    id: data.id || undefined,
    name: data.name || undefined,
    description: data.description || undefined,
    projectId: data.projectId || undefined,
  };
}
