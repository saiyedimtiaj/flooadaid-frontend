"use client";

import { Check, Loader2, Phone, ShieldCheck, Siren } from "lucide-react";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

export const EMERGENCY_NUMBERS = [
  { service: "National Emergency", serviceBn: "জাতীয় জরুরি সেবা", number: "999" },
  { service: "Flood Warning (FFWC)", serviceBn: "বন্যা সতর্কতা (FFWC)", number: "10941" },
  { service: "Fire & Rescue", serviceBn: "ফায়ার সার্ভিস ও উদ্ধার", number: "199" },
  { service: "Health (DGHS)", serviceBn: "স্বাস্থ্যসেবা (DGHS)", number: "16263" },
];

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export function SendButton({
  onClick,
  isSubmitting,
  className,
}: {
  onClick: () => void;
  isSubmitting: boolean;
  className?: string;
}) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSubmitting}
      className={cn(
        "relative inline-flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-destructive px-6 text-base font-bold text-white shadow-[0_12px_30px_-10px_oklch(0.577_0.245_27.325/0.8)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-80",
        className,
      )}
    >
      {!isSubmitting && <span className="absolute inset-0 animate-pulse bg-white/10" aria-hidden />}
      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Siren className="h-5 w-5" />}
      <span className="relative">{isSubmitting ? t("sos.sending") : t("sos.sendShort")}</span>
    </button>
  );
}

export function SOSSummary({
  items,
  onSubmit,
  isSubmitting,
}: {
  items: ChecklistItem[];
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const { t, num } = useT();
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="bg-primary px-5 py-5 text-primary-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{t("sos.checklist")}</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-3xl font-bold tabular-nums">{num(pct)}%</p>
          <p className="text-sm text-white/70">
            {num(done)} / {num(items.length)} {t("sos.progressDone")}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="flex flex-col gap-2.5 px-5 py-4">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                i.done ? "bg-primary text-lime" : "border-2 border-border",
              )}
            >
              {i.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <span className={i.done ? "font-medium text-foreground" : "text-muted-foreground"}>{i.label}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 border-t border-border p-5">
        <SendButton onClick={onSubmit} isSubmitting={isSubmitting} />
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          {t("sos.safeInfo")}
        </p>
      </div>
    </section>
  );
}

export function EmergencyNumbers() {
  const { t, tr, num } = useT();
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h2 className="font-bold text-foreground">{t("sos.emergencyNumbers")}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {EMERGENCY_NUMBERS.map((n) => (
          <a
            key={n.number}
            href={`tel:${n.number}`}
            className="group flex flex-col rounded-2xl border border-border p-3 transition-colors hover:border-destructive/40 hover:bg-destructive/5"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-lg font-bold text-destructive">
              <Phone className="h-4 w-4" />
              {num(n.number)}
            </span>
            <span className="mt-0.5 text-xs text-muted-foreground">{tr(n.service, n.serviceBn)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
