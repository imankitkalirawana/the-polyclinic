import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function GET() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Sample HTML Content
  const htmlContent = '';

  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A6' });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="appointment-confirmation.pdf"'
    }
  });
}
