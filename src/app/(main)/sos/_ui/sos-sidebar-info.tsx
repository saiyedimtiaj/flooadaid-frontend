"use client";

import Link from "next/link";
import { motion as m } from "framer-motion";
import { Phone, ShieldCheck, Info, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EmergencyContact {
  service: string;
  org: string;
  number: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { service: "National Emergency", org: "Bangladesh Police", number: "999" },
  { service: "Flood Warning", org: "FFWC Hotline", number: "10941" },
  { service: "Fire & Rescue", org: "Fire Service", number: "199" },
  { service: "Health Emergency", org: "DGHS Hotline", number: "16263" },
];

const SAFETY_TIPS = [
  "Move to the highest point available — rooftop, upper floor, or elevated ground",
  "Keep your phone charged and on. Turn off unnecessary apps to save battery",
  "If you have a whistle or can make loud sounds, use them to attract rescuers",
  "Do not attempt to walk or swim through moving water",
  "Drink only clean or boiled water. Avoid flood water contact with open wounds",
  "Keep children and elderly members close and visible at all times",
];

export default function SOSSidebarInfo() {
  return (
    <div className="flex flex-col gap-5">
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="rounded-3xl border border-destructive/20 bg-linear-to-br from-destructive/6 via-card to-card overflow-hidden">
          <div className="p-5 pb-0 flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-destructive/10 text-destructive shrink-0">
              <Phone className="size-4.5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Emergency Numbers
            </h3>
          </div>

          <div className="p-5 pt-3 flex flex-col">
            {EMERGENCY_CONTACTS.map((contact, index) => (
              <div key={contact.number}>
                <div className="flex justify-between items-center py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {contact.service}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contact.org}
                    </span>
                  </div>

                  <m.a
                    whileTap={{ scale: 0.97 }}
                    href={`tel:${contact.number}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/8 border border-destructive/15 hover:bg-destructive/15 text-sm font-mono font-bold text-destructive transition-colors"
                  >
                    <Phone className="size-3.5" />
                    <span>{contact.number}</span>
                  </m.a>
                </div>
                {index < EMERGENCY_CONTACTS.length - 1 && (
                  <Separator className="bg-border/60" />
                )}
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <div className="flex gap-2 p-3 bg-background/60 border border-border/60 rounded-xl">
              <Info className="size-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-snug">
                All numbers are toll-free and available 24/7. Use a local SIM
                card even in poor network zones.
              </p>
            </div>
          </div>
        </Card>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="rounded-3xl border border-border bg-card overflow-hidden">
          <div className="p-5 pb-0 flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 shrink-0">
              <ShieldCheck className="size-4.5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              While Waiting for Help
            </h3>
          </div>

          <div className="p-5 pt-3 flex flex-col">
            {SAFETY_TIPS.map((tip, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + 0.03 * index, duration: 0.25 }}
                className="flex items-start gap-2.5 py-2"
              >
                <div className="rounded-lg bg-emerald-500/10 size-6 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {tip}
                </span>
              </m.div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <Link
              href="/safety"
              className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
            >
              <span>View complete safety guide</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </Card>
      </m.div>
    </div>
  );
}
