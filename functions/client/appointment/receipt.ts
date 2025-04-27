'use client';
import { toast } from 'sonner';

import { printAppointmentReceipt } from '@/functions/server-actions/receipt';

export const downloadAppointmentReceipt = async (aid: number) => {
  try {
    if (!aid) throw new Error('Invalid appointment ID');
    const res = await printAppointmentReceipt(aid);
    if (!res || !res.pdf) throw new Error('Invalid PDF response');

    const pdfBlob = new Blob(
      [Uint8Array.from(atob(res.pdf), (c) => c.charCodeAt(0))],
      {
        type: 'application/pdf',
      }
    );

    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointment-receipt.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('Downloaded appointment receipt');
  } catch (err: any) {
    console.error(err);
    toast.error(err.message);
  }
};
