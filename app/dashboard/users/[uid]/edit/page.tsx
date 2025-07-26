import EditUser from '@/components/dashboard/users/edit';

interface Props {
  params: Promise<{
    uid: number;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  return <EditUser uid={params.uid} />;
}
