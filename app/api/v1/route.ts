import VercelInviteUserEmail from '@/components/template';
import { emails } from '@/lib/resend';

export async function POST() {
  try {
    const { data, error } = await emails.send({
      from: 'Ankit Kalirawana <ankit@thepolyclinic.app>',
      to: ['009ankitkalirawana@gmail.com'],
      subject: 'Hello world',
      react: VercelInviteUserEmail({
        username: 'Ankit Kalirawana',
        userImage: 'https://github.com/shadcn.png',
        invitedByUsername: 'Ankit Kalirawana',
        invitedByEmail: 'ankit@thepolyclinic.app',
        teamName: 'The Polyclinic',
        teamImage: 'https://github.com/shadcn.png',
        inviteLink: 'https://thepolyclinic.app',
        inviteFromIp: '127.0.0.1',
        inviteFromLocation: 'India',
      }),
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
