"use client";

import { motion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Phone,
  Check,
  X,
  CloudRain,
  Waves,
  Home,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PublicHero } from "@/components/public/public-hero";

const EMERGENCY_CONTACTS = [
  { service: "National Emergency", org: "Bangladesh Police", number: "999" },
  { service: "Flood Warning", org: "FFWC Hotline", number: "10941" },
  { service: "Fire & Rescue", org: "Fire Service", number: "199" },
  { service: "Health Emergency", org: "DGHS Hotline", number: "16263" },
];

const PHASES = [
  {
    icon: CloudRain,
    phase: "Before a Flood",
    tint: "text-info bg-info/10",
    tips: [
      "Keep an emergency kit ready: dry food, clean water, medicine, a torch, and a power bank.",
      "Know your nearest shelter and the safest route to reach it on higher ground.",
      "Store important documents in a waterproof bag or take clear photos on your phone.",
      "Charge all phones and power banks fully when a flood warning is issued.",
    ],
  },
  {
    icon: Waves,
    phase: "During a Flood",
    tint: "text-destructive bg-destructive/10",
    tips: [
      "Move to the highest point available — rooftop, upper floor, or elevated ground.",
      "Never walk or swim through moving water; even 15 cm can knock you off your feet.",
      "Turn off electricity and gas if it is safe to reach the mains.",
      "Send an SOS with your GPS location and keep your phone on to receive updates.",
    ],
  },
  {
    icon: Home,
    phase: "After a Flood",
    tint: "text-emerald-600 dark:text-emerald-500 bg-emerald-500/10",
    tips: [
      "Return home only when authorities declare it safe. Watch for weakened structures.",
      "Drink only boiled or bottled water; flood water is often contaminated.",
      "Avoid contact between flood water and open wounds to prevent infection.",
      "Document any damage with photos before cleaning up, for relief and insurance.",
    ],
  },
];

const DOS = [
  "Listen to official flood warnings and evacuation orders",
  "Keep children and elderly members close and visible at all times",
  "Use a whistle or loud sounds to signal rescuers if stranded",
  "Help neighbours who may need assistance evacuating",
];

const DONTS = [
  "Don't drive or walk through flooded roads",
  "Don't touch electrical equipment if you are wet or in water",
  "Don't ignore evacuation orders to protect belongings",
  "Don't drink or cook with untreated flood water",
];

const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function SafetyPage() {
  return (
    <div className="bg-background">
      <PublicHero
        eyebrow="Safety Guidelines"
        breadcrumb="Safety"
        icon={ShieldCheck}
        title="Flood Safety, Before It's Too Late"
        description="Practical, life-saving guidance for every stage of a flood — prepare early, act fast, and recover safely."
      />

      {/* Emergency numbers band */}
      <section className="py-10 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-destructive" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Emergency Numbers — Toll-Free, 24/7
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {EMERGENCY_CONTACTS.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="group flex items-center justify-between gap-2 rounded-2xl border border-destructive/20 bg-card p-4 transition-colors hover:bg-destructive/5"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{c.service}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{c.org}</p>
                </div>
                <span className="text-lg font-mono font-extrabold text-destructive shrink-0">{c.number}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Phase cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {PHASES.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.phase} variants={item}>
                  <Card className="h-full rounded-3xl border border-border bg-card p-6">
                    <div className={`flex items-center justify-center h-12 w-12 rounded-2xl mb-4 ${p.tint}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{p.phase}</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {p.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2.5">
                          <div className="rounded-lg bg-emerald-500/10 size-5 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Do / Don't */}
      <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
                <Check className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-foreground">Do</h3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {DOS.map((d) => (
                <li key={d} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-500 mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-destructive/15 text-destructive">
                <X className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-foreground">Don&apos;t</h3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {DONTS.map((d) => (
                <li key={d} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-destructive mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              This guidance is general advice for flood-prone areas of Bangladesh. Always follow
              instructions from local authorities and the Flood Forecasting &amp; Warning Centre (FFWC),
              which take precedence in any specific emergency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
