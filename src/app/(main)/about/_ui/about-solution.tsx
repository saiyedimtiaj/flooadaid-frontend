"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Home,
  Siren,
  Package,
  Users,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Real-Time Flood Alerts",
    description:
      "District-level water monitoring with five severity levels. Get alerts for your area before the water reaches your doorstep.",
    link: "/alerts",
    icon: AlertTriangle,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/8",
    accentBg: "bg-destructive",
  },
  {
    id: 2,
    title: "Shelter Finder",
    description:
      "Locate nearby emergency shelters with live capacity data, facility information, and GPS directions — all on an interactive map.",
    link: "/shelters",
    icon: Home,
    colorClass: "text-success",
    bgClass: "bg-success/8",
    accentBg: "bg-success",
  },
  {
    id: 3,
    title: "Emergency SOS",
    description:
      "Send a GPS-located rescue request with one tap. Track your request status in real-time as volunteers respond.",
    link: "/sos",
    icon: Siren,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/8",
    accentBg: "bg-destructive",
  },
  {
    id: 4,
    title: "Relief Distribution Tracker",
    description:
      "Track where relief has been delivered and where it hasn't. Prevent duplication and identify underserved communities.",
    link: "/tracker",
    icon: Package,
    colorClass: "text-warning",
    bgClass: "bg-warning/8",
    accentBg: "bg-warning",
  },
  {
    id: 5,
    title: "Volunteer Coordination",
    description:
      "Register as a volunteer, get assigned to rescue operations, and coordinate with teams — all through one platform.",
    link: "/volunteer",
    icon: Users,
    colorClass: "text-primary",
    bgClass: "bg-primary/8",
    accentBg: "bg-primary",
  },
  {
    id: 6,
    title: "Reports & Analytics",
    description:
      "Dashboard statistics, SOS resolution rates, relief coverage maps, and exportable reports for government authorities.",
    link: "/dashboard",
    icon: BarChart3,
    colorClass: "text-info",
    bgClass: "bg-info/8",
    accentBg: "bg-info",
  },
];

export default function AboutSolution() {
  const headerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center justify-center mx-auto">
            <span className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary ml-3">
              Our Solution
            </span>
          </div>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground text-balance">
            A Complete Flood Response Platform
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
            Six integrated modules working together to protect communities
            before, during, and after floods
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-background rounded-xl border border-border p-6 flex flex-col justify-between"
              >
                <div>
                  <motion.div
                    variants={{
                      hover: { width: 48 },
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={`h-1 w-8 rounded-full ${feature.accentBg}`}
                  />

                  <div
                    className={`mt-4 rounded-xl ${feature.bgClass} size-11 flex items-center justify-center`}
                  >
                    <IconComponent className={`size-5 ${feature.colorClass}`} />
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    href={feature.link}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                  >
                    <span>Explore</span>
                    <motion.div
                      variants={{
                        hover: { x: 3 },
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ArrowRight className="size-3" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="mt-12 bg-primary/5 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto text-center border border-primary/10"
        >
          <Zap className="size-5 text-primary mx-auto" />
          <p className="mt-3 text-sm md:text-base text-foreground leading-relaxed">
            All six modules are integrated — an alert in one district
            automatically highlights nearby shelters, notifies registered
            volunteers, and flags areas needing relief.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
