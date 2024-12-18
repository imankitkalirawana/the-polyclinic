import { ChevronDown, Calendar } from 'lucide-react';
import Skeleton from '../ui/skeleton';

export default function FormSkeleton() {
  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="space-y-6">
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Skeleton className="h-10 w-24" /> {/* Cancel button */}
          <Skeleton className="h-10 w-32" /> {/* Save Changes button */}
        </div>
      </div>
    </div>
  );
}
