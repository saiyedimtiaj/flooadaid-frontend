"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Siren, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShelterSosCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6"
      style={{ background: "var(--gradient-sunset)" }}
    >
      <div
        className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"
        aria-hidden="true"
      />
      <motion.div
        className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -right-10 -bottom-16 h-56 w-56 rounded-full bg-white/10 blur-3xl pointer-events-none"
        animate={{ opacity: [0.5, 0.25, 0.5] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
        <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-white/15 text-white shrink-0">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-white/50"
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-white/50"
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.6,
            }}
            aria-hidden="true"
          />
          <Siren className="h-7 w-7 relative z-10" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-extrabold text-white text-balance">
            Can&apos;t find a shelter nearby?
          </h3>
          <p className="text-sm text-white/80 mt-1 max-w-md">
            Send an emergency SOS with your location — volunteers and rescue
            teams will be dispatched to you directly.
          </p>
        </div>
      </div>

      <Button
        variant={"ghost"}
        className="relative shrink-0 font-bold bg-white text-foreground hover:bg-white/90 shadow-lg group"
      >
        <Link href="/sos" className="flex items-center justify-center gap-1.5">
          Request Emergency SOS
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </motion.div>
  );
}
