"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  HeartHandshake,
  LifeBuoy,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicHero } from "@/components/public/public-hero";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { cn } from "@/lib/utils";

const SKILLS = [
  { icon: LifeBuoy, label: "Boat operation & rescue" },
  { icon: Stethoscope, label: "Medical & first aid" },
  { icon: Boxes, label: "Relief distribution & logistics" },
  { icon: Users, label: "Shelter coordination" },
];

const STEPS = [
  {
    step: "1",
    title: "Create an account",
    description: "Sign up with your name, phone number, and home district.",
  },
  {
    step: "2",
    title: "Register your skills",
    description: "Tell us what you're good at and when you're available.",
  },
  {
    step: "3",
    title: "Get verified & assigned",
    description: "An admin verifies your profile, then you'll be assigned to SOS requests near you.",
  },
];

const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function GetInvolvedPage() {
  const { data: user } = useCurrentUser();

  const primaryCta = !user
    ? { href: "/signup", label: "Sign Up to Volunteer" }
    : user.role === "VOLUNTEER"
      ? { href: "/volunteer", label: "Go to Volunteer Dashboard" }
      : { href: "/volunteer/profile", label: "Register as Volunteer" };

  return (
    <div className="bg-background">
      <PublicHero
        eyebrow="Join the Movement"
        breadcrumb="Get Involved"
        icon={HeartHandshake}
        title="Every Hand Counts When the Water Rises"
        description="FloodAid BD volunteers coordinate rescues, distribute relief, and staff shelters across flood-affected districts. Register once — we'll match you to nearby SOS requests as they come in."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-14 md:py-20">
        <div className="flex justify-center mb-16">
          <Link href={primaryCta.href} className={cn(buttonVariants({ size: "xl" }), "font-bold gap-2")}>
            {primaryCta.label}
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>

        {/* Skills */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Skills That Save Lives</h2>
          <p className="text-sm text-muted-foreground mt-2">Whatever you&apos;re good at, there&apos;s a role for you.</p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {SKILLS.map(({ icon: Icon, label }) => (
            <motion.div key={label} variants={item}>
              <Card className="group h-full rounded-2xl border border-border bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/25">
                <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto mb-3 transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Steps */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Three Steps to Get Started</h2>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STEPS.map((s) => (
            <motion.div key={s.step} variants={item} className="flex flex-col items-start">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] text-primary-foreground text-sm font-extrabold mb-3 shadow-sm">
                {s.step}
              </div>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Already registered */}
        <Card className="rounded-3xl border border-border bg-linear-to-br from-emerald-500/6 via-card to-card p-6 md:p-8 mt-16 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Already registered?</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Sign in to view your assigned tasks and update your availability.
              </p>
            </div>
          </div>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "font-semibold shrink-0")}>
            Sign In
          </Link>
        </Card>
      </div>
    </div>
  );
}
