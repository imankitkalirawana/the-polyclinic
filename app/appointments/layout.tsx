export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-8xl px-4 md:px-8 lg:px-12">{children}</div>
  );
}
