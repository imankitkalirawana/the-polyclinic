import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

export default function Loading() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <MinimalPlaceholder message="Loading..." />
    </div>
  );
}
