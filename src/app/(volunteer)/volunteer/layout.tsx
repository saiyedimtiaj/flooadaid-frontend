import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell allowedRoles={["USER", "VOLUNTEER"]} navRole="VOLUNTEER">
      {children}
    </DashboardShell>
  );
}
