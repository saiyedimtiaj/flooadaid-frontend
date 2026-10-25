"use client";

import { ShieldAlert, Home, Users } from "lucide-react";
import { useDistrictOverview, usePublicSummary } from "@/lib/hooks/use-stats";

const GAUGE_STOPS = [
  { key: "NORMAL", color: "var(--alert-normal)", label: "Normal" },
  { key: "WATCH", color: "var(--alert-watch)", label: "Watch" },
  { key: "WARNING", color: "var(--alert-warning)", label: "Warning" },
  { key: "DANGER", color: "var(--alert-danger)", label: "Danger" },
  { key: "CRITICAL", color: "var(--alert-critical)", label: "Critical" },
];

/** National severity gauge + headline numbers on the auth screens, from live data. */
export function AuthSituationPanel() {
  const { data: overview } = useDistrictOverview();
  const { data: summary } = usePublicSummary();

  // Worst active alert anywhere in the country; Normal when there are none.
  const current = Math.max(
    0,
    ...(overview?.districts ?? [])
      .filter((d) => d.alert)
      .map((d) => GAUGE_STOPS.findIndex((s) => s.key === d.alert!.severity)),
  );
  const fmt = (n: number | undefined) => (n === undefined ? "—" : n.toLocaleString());

  return (
    <>
          <div className="rounded-2xl bg-white/6 backdrop-blur-md ring-1 ring-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Current severity
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: GAUGE_STOPS[current].color }}
              >
                {GAUGE_STOPS[current].label}
              </span>
            </div>

            <div className="relative">
              <div className="flex gap-1">
                {GAUGE_STOPS.map((stop, i) => (
                  <div
                    key={stop.key}
                    className="h-2 flex-1 rounded-full transition-opacity"
                    style={{
                      background: stop.color,
                      opacity: i <= current ? 1 : 0.2,
                    }}
                  />
                ))}
              </div>
              <span
                className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full ring-2 ring-white gauge-pulse-accent"
                style={{
                  left: `${((current + 0.5) / GAUGE_STOPS.length) * 100}%`,
                  background: GAUGE_STOPS[current].color,
                }}
              />
            </div>

            <div className="flex justify-between mt-2.5">
              <span className="text-[10px] text-white/40">Normal</span>
              <span className="text-[10px] text-white/40">Critical</span>
            </div>
          </div>


          <div className="grid grid-cols-3 gap-3">
            <Stat icon={ShieldAlert} value={fmt(summary?.districtsOnAlert)} label="districts on alert" />
            <Stat icon={Home} value={fmt(summary?.sheltersOpen)} label="shelters open" />
            <Stat icon={Users} value={fmt(summary?.sosResolvedToday)} label="SOS resolved today" />
          </div>
    </>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof ShieldAlert;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/6 backdrop-blur-md ring-1 ring-white/10 p-3 flex flex-col gap-1.5">
      <Icon className="h-4 w-4 text-white/50" />
      <div className="text-xl font-extrabold text-white leading-none tabular-nums">{value}</div>
      <div className="text-[10px] text-white/50 leading-tight">{label}</div>
    </div>
  );
}
