export default function LoadingPage() {
  return (
    <>
      <div className="flex h-[90vh] w-full flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary-400 text-4xl text-primary-400">
          <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-secondary-400 text-2xl text-secondary-400"></div>
        </div>
      </div>
    </>
  );
}
