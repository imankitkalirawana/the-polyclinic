import { AppointmentQueueApi } from '@/services/client/appointment/queue/queue.api';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import { RazorpayOptions, RazorpayPaymentResponse } from '@/types';
import { loadRazorpay } from '@/utils/loadRazorpay';
import { addToast, Alert, Button } from '@heroui/react';
import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';

type PaymentStatus = 'idle' | 'loading' | 'success' | 'failed' | 'cancelled';

export default function PaymentFooter() {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef(false);
  const form = useFormContext<CreateAppointmentQueueFormValues>();

  const appointment = form.watch('appointment');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
    };
  }, []);

  const handleCashPayment = async () => {
    if (isProcessingRef.current) return;

    setError(null);
    setStatus('loading');
    isProcessingRef.current = true;

    try {
      const createAppointmentResponse = await AppointmentQueueApi.create({
        ...appointment,
        paymentMode: 'CASH',
      });

      if (!createAppointmentResponse.success || !createAppointmentResponse.data) {
        setStatus('failed');
        setError(createAppointmentResponse.message);
        return;
      }

      setStatus('success');
      addToast({
        title: 'Appointment booked successfully',
        description: 'Your appointment has been booked. Please pay at the clinic.',
        color: 'success',
      });

      form.setValue('appointment.aid', createAppointmentResponse.data.aid);
      form.setValue('meta.showReceipt', true);
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleRazorpayPayment = async () => {
    if (isProcessingRef.current) return;

    setError(null);
    setStatus('loading');
    isProcessingRef.current = true;

    try {
      await loadRazorpay();
    } catch (err) {
      setStatus('failed');
      setError('Failed to load payment gateway. Please try again.');
      isProcessingRef.current = false;
      return;
    }

    try {
      const createAppointmentResponse = await AppointmentQueueApi.create({
        ...appointment,
        paymentMode: 'RAZORPAY',
      });

      if (!createAppointmentResponse.success || !createAppointmentResponse.data) {
        setStatus('failed');
        setError(createAppointmentResponse.message);
        isProcessingRef.current = false;
        return;
      }

      form.setValue('appointment.aid', createAppointmentResponse.data.aid);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_RwXKuh4eV9Pxy6';

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: createAppointmentResponse.data.payment.amount,
        currency: createAppointmentResponse.data.payment.currency,
        name: 'The Polyclinic',
        order_id: createAppointmentResponse.data.payment.orderId,
        handler: async function (response: RazorpayPaymentResponse) {
          try {
            const verificationResponse = await AppointmentQueueApi.verifyPayment({
              orderId: createAppointmentResponse.data?.payment.orderId ?? '',
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (!verificationResponse.success) {
              setStatus('failed');
              setError(verificationResponse.message);
              isProcessingRef.current = false;
              return;
            }

            setStatus('success');
            addToast({
              title: 'Payment verified successfully',
              description: 'Your appointment has been booked successfully',
              color: 'success',
            });

            form.setValue('meta.showReceipt', true);
          } catch (err) {
            setStatus('failed');
            setError(err instanceof Error ? err.message : 'Payment verification failed');
          } finally {
            isProcessingRef.current = false;
          }
        },
        modal: {
          onDismiss: () => {
            setStatus('cancelled');
            setError('Payment was cancelled, please try again or contact support');
            isProcessingRef.current = false;
          },
        },
        payment: {
          failed: (response) => {
            setStatus('failed');
            setError(response.error.description || 'Payment failed. Please try again.');
            isProcessingRef.current = false;
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: unknown) => {
        const errorResponse = response as { error?: { description?: string } };
        setStatus('failed');
        setError(errorResponse.error?.description || 'Payment failed. Please try again.');
        isProcessingRef.current = false;
      });

      razorpay.open();
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      isProcessingRef.current = false;
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col">
        <div className="text-default-500 text-xs">You are going to pay</div>
        <div className="flex gap-2 text-3xl">
          <span>₹</span>
          <span>100</span>
        </div>
      </div>
      {error && (
        <div>
          <Alert hideIcon color="danger" className="text-small py-0">
            <p dangerouslySetInnerHTML={{ __html: error }} />
          </Alert>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          isLoading={status === 'loading'}
          isDisabled={status === 'loading' || status === 'success' || isProcessingRef.current}
          variant="bordered"
          radius="full"
          onPress={handleCashPayment}
          startContent={<Icon icon="solar:wad-of-money-bold-duotone" width={20} />}
        >
          Pay by cash
        </Button>
        <Button
          isLoading={status === 'loading'}
          isDisabled={status === 'loading' || status === 'success' || isProcessingRef.current}
          color="primary"
          radius="full"
          onPress={handleRazorpayPayment}
          startContent={<Icon icon="solar:card-2-bold-duotone" width={18} />}
        >
          Pay online
        </Button>
      </div>
    </div>
  );
}
