import { Template } from '@/components/template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ankit Kalirawana <ankit@thepolyclinic.app>',
      to: ['009ankitkalirawana@gmail.com'],
      subject: 'Hello world',
      text: 'Hello world',
      react: Template(),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
