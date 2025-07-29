import { Button } from '@heroui/react';

import Loading from '@/app/loading';
import { SlotsPreview } from '@/components/dashboard/doctors/doctor/slots/slots-preview';
import { useModal } from '@/components/ui/global-modal';
import { useSlotsByUID } from '@/services/slots';

export default function DoctorSlots({
  selectedDoctor,
  selectedSlot,
  setSelectedSlot,
}: {
  selectedDoctor: number;
  selectedSlot?: Date;
  setSelectedSlot: (date: Date) => void;
}) {
  const { data: slots, isLoading: isSlotsLoading } = useSlotsByUID(selectedDoctor);
  const modal = useModal();

  if (isSlotsLoading) {
    return <Loading />;
  }

  if (!slots) {
    return <div>No slots found</div>;
  }

  return (
    <div>
      <Button
        onPress={() =>
          modal.show({
            body: (
              <SlotsPreview
                config={slots}
                setSelectedSlot={setSelectedSlot}
                selectedSlot={selectedSlot}
              />
            ),
            props: {
              size: '5xl',
            },
          })
        }
      >
        Choose slot
      </Button>
    </div>
  );
}
