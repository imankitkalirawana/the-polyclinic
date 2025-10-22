import KPISummaryCards from './kpi-summary-card';

export default function Dashboard() {
  return (
    <div className="flex w-full gap-4">
      {/* main content */}
      <div className="flex w-full flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <KPISummaryCards />
        </div>
      </div>
      {/* sidebar */}
      <aside className="w-full max-w-64">Sidebar</aside>
    </div>
  );
}
