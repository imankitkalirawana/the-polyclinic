import UserCard from '@/components/dashboard/users/user';

interface Props {
  params: {
    uid: number;
  };
}

const UserPage = async ({ params }: Props) => {
  return (
    <>
      <UserCard uid={params.uid} />
    </>
  );
};

export default UserPage;
