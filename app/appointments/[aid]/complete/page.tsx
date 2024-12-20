import Error from '@/app/error';
import { auth } from '@/auth';
import CompleteAppointment from '@/components/appointments/id/complete';
import { getAllDrugs } from '@/functions/server-actions';
import { API_BASE_URL } from '@/lib/config';
import { AppointmentType } from '@/models/Appointment';
import { DrugType } from '@/models/Drug';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData(aid: number) {
  try {
    const res = await axios.get(`${API_BASE_URL}api/appointments/${aid}`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
}

interface PageProps {
  params: {
    aid: number;
  };
}

export default async function Page({ params }: PageProps) {
  const appointment: AppointmentType =
    (await getData(params.aid)) || ({} as AppointmentType);
  const drugs: DrugType[] = await getAllDrugs();
  const session = await auth();
  const allowed = ['admin', 'doctor'];
  return (
    <>
      {
        // @ts-ignore
        session && allowed.includes(session.user.role) ? (
          <div className="max-w-8xl h-full w-full px-2">
            <CompleteAppointment appointment={appointment} drugs={drugs} />
          </div>
        ) : (
          <Error
            code="401"
            title="Whoops, Not So Fast"
            description="You're trying to peek behind the curtain, but authorization is required. Let's set things right."
          />
        )
      }
    </>
  );
}
