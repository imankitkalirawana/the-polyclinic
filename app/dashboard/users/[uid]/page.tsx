import UserCard from '@/components/dashboard/users/user';

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  return (
    <>
      <UserCard uid={params.uid} />
    </>
  );
}
