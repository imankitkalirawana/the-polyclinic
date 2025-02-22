'use server';

import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import Doctor from '@/models/Doctor';
import { Receipt } from '@/utils/receipt-template/receipt';
import puppeteer from 'puppeteer';

export const printAppointmentReceipt = async (aid: number) => {
  await connectDB();
  const appointment = await Appointment.findOne({ aid }).lean();
  if (!appointment) {
    throw new Error('Appointment not found');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = Receipt(appointment);
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A5' });

  await browser.close();

  return {
    pdf: Buffer.from(pdfBuffer).toString('base64') // Convert Buffer to Base64
  };
};
