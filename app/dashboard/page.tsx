import { auth } from '@/auth';
import DashboardTableSkeleton from '@/components/skeletons/dashboard/dashboard-table-skeleton';

export default async function Dashboard() {
  const session = await auth();

  return (
    <>
      <DashboardTableSkeleton />
    </>
  );
}
