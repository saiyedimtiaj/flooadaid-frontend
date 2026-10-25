"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Workflow,
  Radar,
  MapPin,
  Siren,
  LifeBuoy,
  ArrowRight,
  UserRound,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion";
import { PublicHero } from "@/components/public/public-hero";

const STEPS = [
  {
    icon: Radar,
    title: "Check Flood Alerts",
    description:
      "See real-time water levels and severity alerts for your district on an interactive map. Know before the water reaches you.",
    tint: "text-destructive bg-destructive/10",
  },
  {
    icon: MapPin,
    title: "Find the Nearest Shelter",
    description:
      "Locate open emergency shelters with live capacity, facilities (food, water, medical), and GPS directions — sorted by distance.",
    tint: "text-primary bg-primary/10",
  },
  {
    icon: Siren,
    title: "Send an Emergency SOS",
    description:
      "One tap sends a GPS-located rescue request with your details. No account needed — help is dispatched to your exact location.",
    tint: "text-amber-600 dark:text-amber-500 bg-amber-500/10",
  },
  {
    icon: LifeBuoy,
    title: "Get Rescued & Track It",
    description:
      "A volunteer or rescue team is assigned to your request. Track the status live from pending to rescued, right from your phone.",
    tint: "text-emerald-600 dark:text-emerald-500 bg-emerald-500/10",
  },
];

const PATHS = [
  {
    icon: UserRound,
    role: "For Residents",
    description: "Check alerts, find shelters, and send SOS requests during a flood — no sign-up required to get help.",
    href: "/sos",
    cta: "Send an SOS",
  },
  {
    icon: HeartHandshake,
    role: "For Volunteers",
    description: "Register your skills and district, get verified, and receive nearby rescue assignments to coordinate response.",
    href: "/get-involved",
    cta: "Become a Volunteer",
  },
  {
    icon: ShieldCheck,
    role: "For Authorities",
    description: "Post district alerts, manage shelters, assign volunteers, log relief, and export situation reports.",
    href: "/login",
    cta: "Admin Sign In",
  },
];

const FAQS = [
  {
    q: "Do I need an account to send an SOS?",
    a: "No. The emergency SOS form is fully public — just share your location and details, and rescuers are notified. You'll get a tracking ID to check your request's status later.",
  },
  {
    q: "How current is the flood and shelter data?",
    a: "Alerts, shelter capacity, and SOS requests are live from our backend. Admins update them in real time, and the pages auto-refresh so you always see the latest state.",
  },
  {
    q: "Is FloodAid BD free to use?",
    a: "Yes, entirely free. It's built as a humanitarian tool for communities across Bangladesh.",
  },
  {
    q: "How do I become a volunteer?",
    a: "Sign up, then complete your volunteer profile with your skills, district, and availability. Once an admin verifies you, you can be assigned to nearby SOS requests.",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HowItWorksPage() {
  return (
    <div className="bg-background">
      <PublicHero
        eyebrow="How It Works"
        breadcrumb="How It Works"
        icon={Workflow}
        title="From First Alert to Safe & Rescued"
        description="FloodAid BD connects people in danger with the information, shelter, and rescue they need — in four simple steps."
      />

      {/* Steps timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} variants={item}>
                  <Card className="group relative h-full rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/25">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center h-12 w-12 rounded-2xl shrink-0 ${step.tint}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-5xl font-black tracking-tighter text-muted/40 font-mono select-none ml-auto">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Role paths */}
      <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Built for Everyone in the Response
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Whether you need help, want to help, or coordinate the response — there&apos;s a path for you.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {PATHS.map((path) => {
              const Icon = path.icon;
              return (
                <motion.div key={path.role} variants={item}>
                  <Card className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
                    <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{path.role}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                      {path.description}
                    </p>
                    <Link
                      href={path.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      {path.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionPanel>{faq.a}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <Button size="xl" className="font-bold gap-2" nativeButton={false} render={<Link href="/sos" className="flex items-center gap-2" />}>
                <Siren className="h-5 w-5" />
                Get Help Now
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
