import { AppointmentQueueApi } from '@/services/client/appointment/queue/api';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/types';
import { PaymentApi } from '@/services/client/payment/api';
import { $FixMe } from '@/types';
import { loadRazorpay } from '@/utils/loadRazorpay';
import { addToast, Button, Card, CardBody, CardFooter } from '@heroui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
} from '../../../(common)';
import { Icon } from '@iconify/react/dist/iconify.js';

type PaymentStatus = 'idle' | 'loading' | 'success' | 'failed' | 'cancelled';

export default function PaymentConfirmation() {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const form = useFormContext<CreateAppointmentQueueFormValues>();

  const appointment = form.watch('appointment');

  const payAndConfirm = async () => {
    setError(null);
    setStatus('loading');
    await loadRazorpay();

    const createAppointmentResponse = await AppointmentQueueApi.create(appointment);

    if (!createAppointmentResponse.success || !createAppointmentResponse.data) {
      setStatus('failed');
      setError(createAppointmentResponse.message);
      return;
    }

    const options = {
      key: 'rzp_test_RwXKuh4eV9Pxy6',
      amount: createAppointmentResponse.data.amount,
      currency: createAppointmentResponse.data.currency,
      name: 'The Polyclinic',
      order_id: createAppointmentResponse.data.orderId,
      handler: async function (response: $FixMe) {
        const verificationResponse = await PaymentApi.verifyPayment({
          orderId: createAppointmentResponse.data?.orderId ?? '',
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });

        if (!verificationResponse.success) {
          setStatus('failed');
          setError(verificationResponse.message);
          return;
        }

        setStatus('success');
        addToast({
          title: 'Payment verified successfully',
          description: 'Your appointment has been booked successfully',
          color: 'success',
        });

        form.setValue('meta.showReceipt', true);
      },
      modal: {
        onDismiss: () => {
          setStatus('cancelled');
          setError('Payment was cancelled, please try again or contact support');
        },
      },
    };

    if (appointment.paymentMode === 'RAZORPAY') {
      // @ts-ignore
      new window.Razorpay(options).open();
    }
  };

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Payment Confirmation"
          description="Please select your payment mode and confirm your appointment"
        />
      }
    >
      <div className="flex h-full items-center justify-center">
        <Card className="min-w-80">
          <CardBody className="gap-2 text-center">
            <div className="text-xs text-default-500">
              You are going to pay in <b>INR</b>
            </div>
            <div className="mx-auto flex w-fit items-center justify-center gap-2 border-b border-divider text-3xl">
              <span>₹</span>
              <span>100</span>
            </div>
            <div className="text-xs text-default-500">
              to <b className="text-primary">The Polyclinic</b>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                isLoading={status === 'loading' && appointment.paymentMode === 'RAZORPAY'}
                isDisabled={status === 'failed' || status === 'success'}
                color="primary"
                radius="full"
                onPress={() => {
                  form.setValue('appointment.paymentMode', 'RAZORPAY');
                  payAndConfirm();
                }}
                startContent={<Icon icon="solar:card-2-bold-duotone" width={18} />}
              >
                Pay online
              </Button>
              <Button
                fullWidth
                isLoading={status === 'loading' && appointment.paymentMode === 'CASH'}
                isDisabled={status === 'failed' || status === 'success'}
                variant="bordered"
                radius="full"
                onPress={() => {
                  form.setValue('appointment.paymentMode', 'CASH');
                  payAndConfirm();
                }}
                startContent={<Icon icon="solar:wad-of-money-bold-duotone" width={18} />}
              >
                Pay by cash
              </Button>
            </div>
          </CardBody>
          {error && (
            <CardFooter className="max-w-80 text-center text-danger text-tiny">{error}</CardFooter>
          )}
        </Card>
      </div>
    </CreateAppointmentContentContainer>
  );
}
