'use client';

import { addToast } from '@heroui/react';

import { printAppointmentReceipt } from '@/functions/server-actions/receipt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const downloadAppointmentReceipt = async (aid: number) => {
  try {
    if (!aid) throw new Error('Invalid appointment ID');
    const res = await printAppointmentReceipt(aid);
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
