import EditUser from '@/components/dashboard/users/edit';

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  return (
    <>
      <EditUser uid={params.uid} />
    </>
  );
}
