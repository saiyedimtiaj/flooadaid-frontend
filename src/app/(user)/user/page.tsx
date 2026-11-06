"use client";

import Link from "next/link";
import {
  Home,
  MapPin,
  Radar,
  Siren,
  ShieldCheck,
  UserSearch,
  HeartHandshake,
  Users,
  LifeBuoy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { usePublicSummary } from "@/lib/hooks/use-stats";
import { DashboardWelcomeCard } from "@/components/dashboard/welcome-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActionTile } from "@/components/dashboard/action-tile";
import { LiveAlertsPanel } from "@/components/dashboard/live-alerts-panel";

const SAFETY_STEPS = [
  "Keep your phone charged and a power bank ready",
  "Pack dry food, drinking water and medicine for 3 days",
  "Know the route to your nearest shelter",
  "Move to higher ground as soon as water starts rising",
];

export default function UserDashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: summary, isLoading } = usePublicSummary();

  return (
    <div className="flex flex-col gap-6">
      <DashboardWelcomeCard
        icon={Home}
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "there"}`}
        description="Live flood conditions, safe shelters and emergency help — everything you need during a flood, in one place."
      >
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/sos" />}
            className="rounded-xl bg-lime px-6 font-bold text-lime-foreground hover:bg-lime/90"
          >
            <Siren className="h-4 w-4" />
            Send SOS
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/shelters" />}
            className="rounded-xl border-white/25 bg-transparent px-6 font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            <MapPin className="h-4 w-4" />
            Nearest shelter
          </Button>
        </div>
      </DashboardWelcomeCard>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Districts on alert" value={summary?.districtsOnAlert} icon={Radar} tint="destructive" isLoading={isLoading} highlight href="/alerts" footerLabel="View alerts" />
        <StatCard label="Shelters open" value={summary?.sheltersOpen} icon={Home} tint="success" isLoading={isLoading} href="/shelters" footerLabel="Find a shelter" />
        <StatCard
          label="People sheltered"
          value={summary?.peopleSheltered}
          icon={Users}
          tint="info"
          sub={summary ? `of ${summary.shelterCapacity.toLocaleString()} spaces` : undefined}
          isLoading={isLoading}
          href="/shelters"
          footerLabel="Shelter capacity"
        />
        <StatCard
          label="Rescues completed"
          value={summary?.sosResolved}
          icon={LifeBuoy}
          tint="primary"
          sub={summary ? `${summary.sosOpen} still open` : undefined}
          isLoading={isLoading}
          href="/tracker"
          footerLabel="Track an SOS"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionTile href="/sos" icon={Siren} tone="red" title="Emergency SOS" description="Send your location and get a rescue team on the way." />
            <ActionTile href="/shelters" icon={MapPin} tone="green" title="Find a shelter" description="Open shelters near you with live capacity and directions." />
            <ActionTile href="/alerts" icon={Radar} tone="amber" title="Flood alerts" description="Water levels and warnings for every district." />
            <ActionTile href="/missing-persons" icon={UserSearch} tone="violet" title="Missing persons" description="Search for family or report someone you found." />
          </div>
          <LiveAlertsPanel />
        </div>

        <div className="flex flex-col gap-6">
          <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lime">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Stay-safe checklist</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {SAFETY_STEPS.map((step) => (
                <li key={step} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 shrink-0 text-emerald-500" />
                  {step}
                </li>
              ))}
            </ul>
            <Link href="/safety" className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline">
              Full safety guide →
            </Link>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-accent p-6 text-foreground">
            <div className="relative">
              <HeartHandshake className="h-9 w-9 text-primary" />
              <h3 className="mt-3 text-lg font-extrabold">Become a volunteer</h3>
              <p className="mt-1.5 text-sm text-foreground/70">
                Help rescue families and deliver relief in your district.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/volunteer/profile" />}
                className="mt-5 rounded-xl px-5 font-bold"
              >
                Join now
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
