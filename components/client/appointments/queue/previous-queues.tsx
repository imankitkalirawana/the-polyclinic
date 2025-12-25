import { AppointmentQueueType } from '@/services/client/appointment/queue/types';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import QueuesList from './queues-list';
import { useQueryState } from 'nuqs';

export default function PreviousQueues({
  previousQueues,
}: {
  previousQueues: AppointmentQueueType[];
}) {
  const [_queueId, setQueueId] = useQueryState('id');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log({ isOpen });

  return (
    <>
      <div className="absolute -left-8 top-1/2 flex -translate-y-1/2 flex-wrap gap-3 transition-all hover:-left-1">
        <Tooltip delay={1000} content="View previous appointments" placement="right">
          <button
            className="flex h-20 w-10 items-center justify-center rounded-r-small bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary-600"
            onClick={() => {
              console.log('clicked');
              onOpen();
            }}
            aria-label="Open previous queues"
          >
            Hello
            {/* <Icon icon="solar:history-bold-duotone" width={20} /> */}
          </button>
        </Tooltip>
      </div>
      <Drawer isOpen={isOpen} placement="left" onOpenChange={onOpenChange}>
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Previous Appointments</DrawerHeader>
              <DrawerBody className="p-0">
                <QueuesList
                  queues={previousQueues}
                  className="w-full"
                  onSelect={(queueId) => setQueueId(queueId)}
                />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
