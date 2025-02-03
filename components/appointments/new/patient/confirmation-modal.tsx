'use client';
import CellValue from '@/components/ui/cell-value';
import { AppointmentType } from '@/models/Appointment';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
  Divider,
  ModalFooter,
  Button,
  Image
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { Suspense, useEffect, useRef, useState } from 'react';
import { getDoctorWithUID } from '@/functions/server-actions';
import Skeleton from '@/components/ui/skeleton';
import AsyncComponent from '@/hooks/useAsyncLoading';
import Link from 'next/link';
import { ChipColorMap } from '@/lib/maps';

export default function ConfirmationModal({
  appointment,
  isOpen = true,
  onOpenChange
}: {
  appointment?: AppointmentType;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const captureAndDownload = async () => {
    if (!modalRef.current) return;

    const canvas = await html2canvas(modalRef.current, {
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true
    });

    const image = canvas.toDataURL('image/png');

    // Create a download link
    const link = document.createElement('a');
    link.href = image;
    link.download = 'appointment-receipt.png';
    link.click();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        backdrop="blur"
        hideCloseButton
        isKeyboardDismissDisabled
        scrollBehavior="inside"
      >
        <ModalContent className="px-4">
          {(onClose) =>
            appointment && (
              <>
                <ModalHeader className="flex-col items-center justify-center gap-2">
                  <div className="flex w-fit rounded-full bg-success-50 p-4">
                    <Icon
                      icon="solar:check-circle-bold"
                      className="text-success"
                      width="36"
                    />
                  </div>
                  <h3>Appointment Booked!</h3>
                  <p className="text-center text-xs font-light text-default-500">
                    Confirmation email has been sent to:{' '}
                    <strong>{appointment.email}</strong>
                  </p>
                </ModalHeader>
                <ModalBody className="gap-0 rounded-2xl bg-default-100">
                  <div ref={modalRef} className="p-4">
                    <CellValue
                      label="Appointment ID"
                      value={`#${appointment.uid}`}
                    />
                    <CellValue
                      label="Date & Time"
                      value={
                        (appointment.date &&
                          format(appointment.date as Date, 'PPPp')) ||
                        '-'
                      }
                    />
                    <CellValue
                      label="Status"
                      value={
                        <Chip
                          color={ChipColorMap[appointment.status]}
                          radius="sm"
                          variant="flat"
                          className="capitalize"
                        >
                          {appointment.status}
                        </Chip>
                      }
                    />
                    <Divider className="my-2 border-dashed border-divider" />
                    <CellValue label="Patient" value={appointment.name} />
                    <CellValue
                      label="Phone Number"
                      value={appointment?.phone || '-'}
                    />
                    <CellValue
                      label="Doctor"
                      value={
                        <AsyncComponent
                          fetchData={() => getDoctorWithUID(appointment.uid)}
                          fallback={<Skeleton className="h-5 w-20" />}
                          render={(doctor) => (
                            <span>{doctor?.name || '-'}</span>
                          )}
                        />
                      }
                    />
                    <Divider className="my-2 border-dashed border-divider" />
                    <CellValue
                      label="Booked On"
                      value={format(appointment.createdAt, 'PPPp')}
                    />
                    <div className="mt-4 flex justify-center">
                      <Image
                        className="rounded-none"
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${process.env.NEXT_PUBLIC_URL}/appointments/${appointment.aid}`}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="flex-col-reverse px-0 sm:flex-row">
                  <Button
                    fullWidth
                    variant="bordered"
                    startContent={<Icon icon="tabler:download" width={18} />}
                    onPress={captureAndDownload}
                  >
                    Download Receipt
                  </Button>
                  <Button
                    fullWidth
                    color="primary"
                    endContent={
                      <Icon icon="tabler:arrow-up-right" width={18} />
                    }
                    as={Link}
                    href={`/appointments/${appointment.aid}`}
                  >
                    Track Appointment
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </>
  );
}

const DoctorName = ({ uid }: { uid: number }) => {
  const [doctorName, setDoctorName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getDoctorWithUID(uid).then((doctor) => {
      if (isMounted) setDoctorName(doctor?.name || '-');
    });

    return () => {
      isMounted = false; // Prevents setting state if the component unmounts
    };
  }, [uid]);

  return doctorName ? (
    <span>{doctorName}</span>
  ) : (
    <Skeleton className="h-5 w-20" />
  );
};
