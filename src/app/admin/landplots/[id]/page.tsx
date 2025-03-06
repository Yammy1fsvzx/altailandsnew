import EditLandplotForm from '@/components/admin/landplots/EditLandplotForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditLandplotPage({ params }: PageProps) {
  const { id } = await params
  return <EditLandplotForm id={id} />
}