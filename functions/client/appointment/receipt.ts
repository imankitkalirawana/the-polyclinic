'use client';
// TODO: move this to somewhere else
import { addToast } from '@heroui/react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { $FixMe } from '@/types';

// TODO:  dummy function to fetch appointment receipt
const fetchAppointmentReceipt = async () => {
  return {
    pdf: 'base64-encoded-pdf-string',
  };
};

export const downloadAppointmentReceipt = async (aid: string) => {
  try {
    if (!aid) throw new Error('Invalid appointment ID');
    const res = await fetchAppointmentReceipt();
    if (!res || !res.pdf) throw new Error('Invalid PDF response');

    const pdfBlob = new Blob([Uint8Array.from(atob(res.pdf), (c) => c.charCodeAt(0))], {
      type: 'application/pdf',
    });

    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointment-receipt.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast({
      title: 'Downloaded appointment receipt',
      color: 'success',
    });
  } catch (err: $FixMe) {
    console.error(err);
    addToast({
      title: 'Error',
      description: err.message,
      color: 'danger',
    });
  }
};
