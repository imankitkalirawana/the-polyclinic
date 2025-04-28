import EditUser from '@/components/dashboard/users/edit';

interface Props {
  params: {
    uid: number;
  };
}

const EditUserPage = async ({ params }: Props) => {
  return (
    <>
      <EditUser uid={params.uid} />
    </>
  );
};

export default EditUserPage;
