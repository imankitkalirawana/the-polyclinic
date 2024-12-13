import { useLocale } from '@react-aria/i18n';
import { CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/lib/interface';
import { calculateAge } from '@/lib/client-functions';
import Skeleton from '@/components/ui/skeleton';
import { CalendarDisplay } from './calendar-display';
import { Autocomplete, AutocompleteItem, Chip } from '@nextui-org/react';
import Profile from './profile';

export function LeftPanel({
  user,
  isLoading = false,
  users
}: {
  user?: User;
  isLoading?: boolean;
  users?: User[];
}) {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const slotParam = searchParams.get('slot');

  const currentDate = dateParam ? new Date(dateParam) : new Date();
  const router = useRouter();

  // autocomplete usememo

  return (
    <div className="flex flex-col gap-4 border-r pr-6">
      <div className="grid gap-1">
        <h1 className="text-sm font-semibold">Book New Appointment</h1>
      </div>
      <Autocomplete
        defaultItems={users}
        label="Choose Patient"
        className="max-w-52"
        placeholder="Search for a patient"
        showScrollIndicators={false}
        onSelectionChange={(value) => {
          const url = new URL(window.location.href);
          url.searchParams.set('uid', value ? value.toString() : '');
          router.push(url.toString());
        }}
        isLoading={isLoading}
        selectedKey={user ? user.uid.toString() : ''}
      >
        {(user) => (
          <AutocompleteItem key={user.uid}>{user?.name}</AutocompleteItem>
        )}
      </Autocomplete>
      {isLoading ? <LoadingSkeleton /> : user && <Profile user={user} />}

      <CalendarDisplay date={currentDate} />
    </div>
  );
}

const LoadingSkeleton = () => {
  return (
    <>
      <div className="grid gap-3">
        <div className="space-y-2">
          <Skeleton className="flex h-8 w-full" />
          <Skeleton className="flex h-4 w-36" />
        </div>
        <div className="mt-2 space-y-2">
          <Skeleton className="flex h-4 w-24" />
          <Skeleton className="flex h-4 w-36" />
          <Skeleton className="flex h-4 w-32" />
        </div>
      </div>
    </>
  );
};
