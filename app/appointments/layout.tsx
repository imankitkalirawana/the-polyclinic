export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px4 mx-auto mt-24 max-w-8xl md:px-8 lg:px-12">
      {children}
    </div>
  );
}
