import Modal from '@/components/ui/modal';

export default function EditModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const renderBody = () => {
    return <div>Edit Appointment</div>;
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Appointment" body={renderBody()} />
    </>
  );
}
