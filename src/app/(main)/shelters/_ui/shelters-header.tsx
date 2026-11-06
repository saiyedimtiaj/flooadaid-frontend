"use client";

import { AlertTriangle, CheckCircle2, Home, TrendingUp, Users } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { useShelters } from "@/lib/hooks/use-shelters";
import { useT } from "@/lib/i18n/use-t";

export default function SheltersHeader() {
  const { tr, num } = useT();
  const { data } = useShelters({ limit: 100 });
  const shelters = data?.data;
  const rate = (s: { currentOccupancy: number; capacity: number }) => (s.capacity ? s.currentOccupancy / s.capacity : 0);
  const sheltered = shelters?.reduce((n, s) => n + s.currentOccupancy, 0);
  const capacity = shelters?.reduce((n, s) => n + s.capacity, 0);

  return (
    <PageHero
      icon={Home}
      crumb={tr("Shelters", "আশ্রয়কেন্দ্র")}
      eyebrow={tr("Live capacity", "সরাসরি ধারণক্ষমতা")}
      title={tr("Shelter Finder", "আশ্রয়কেন্দ্র খুঁজুন")}
      description={tr(
        "Find emergency shelters near you with real-time capacity, facilities and turn-by-turn directions.",
        "সরাসরি ধারণক্ষমতা, সুযোগ-সুবিধা ও ধাপে ধাপে দিকনির্দেশনাসহ কাছের জরুরি আশ্রয়কেন্দ্র খুঁজুন।",
      )}
      aside={
        shelters && (
          <p className="inline-flex items-center gap-2 rounded-xl bg-muted/70 px-3.5 py-2 text-sm text-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>
              <strong className="tabular-nums">{sheltered === undefined ? "—" : num(sheltered)}</strong>{" "}
              {tr("people sheltered out of", "জন আশ্রয়ে আছেন; মোট জায়গা")}{" "}
              <strong className="tabular-nums">{capacity === undefined ? "—" : num(capacity)}</strong>
            </span>
          </p>
        )
      }
      stats={[
        { label: tr("Open shelters", "খোলা আশ্রয়কেন্দ্র"), value: shelters ? num(shelters.length) : undefined, icon: Home },
        { label: tr("Plenty of space", "অনেক জায়গা আছে"), value: shelters ? num(shelters.filter((s) => rate(s) < 0.5).length) : undefined, icon: CheckCircle2 },
        { label: tr("Filling fast", "দ্রুত পূর্ণ হচ্ছে"), value: shelters ? num(shelters.filter((s) => rate(s) >= 0.5 && rate(s) < 0.8).length) : undefined, icon: TrendingUp },
        { label: tr("Near capacity", "প্রায় পূর্ণ"), value: shelters ? num(shelters.filter((s) => rate(s) >= 0.8).length) : undefined, icon: AlertTriangle, tone: "alert" },
      ]}
    />
  );
}
