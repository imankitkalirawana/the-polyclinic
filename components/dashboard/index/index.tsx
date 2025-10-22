import KPISummaryCards from './kpi-summary-card';
import AppointmentByTypes from './appointment-by-types';
import { dummyData } from './data';
import Revenue from './revenue';
import { ScrollShadow } from '@heroui/react';
import PatientByAgeGroup from './patient-by-age-group';

export default function Dashboard() {
  return (
    <div className="flex h-full w-full gap-4">
      {/* main content */}
      <ScrollShadow
        className="flex h-full w-full flex-col gap-4 p-4"
        orientation="vertical"
        hideScrollBar
      >
        <div className="grid grid-cols-4 gap-4">
          <KPISummaryCards />
          <div className="col-span-2">
            <AppointmentByTypes {...dummyData.dashboardData.appointmentsByType} />
          </div>
          <div className="col-span-2">
            <PatientByAgeGroup {...dummyData.dashboardData.patientByAgeGroup} />
          </div>
          <div className="col-span-4">
            <Revenue />
          </div>
        </div>
      </ScrollShadow>
      {/* sidebar */}
      <aside className="w-full max-w-64">Sidebar</aside>
    </div>
  );
}
