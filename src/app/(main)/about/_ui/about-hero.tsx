"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function AboutHero() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-background px-4 py-20 text-center">
      {imageError ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.04_247)] to-[oklch(0.12_0.03_260)]" />
      ) : (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/about/hero-flood.webp"
              alt="Flood affected area in Bangladesh"
              fill
              priority
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.1 0.02 247 / 0.75), oklch(0.08 0.02 247 / 0.9))",
            }}
          />
        </>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-[120px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />

      <div className="relative z-30 mx-auto flex max-w-3xl flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <Heart className="size-3.5 text-destructive fill-destructive" />
          <span className="text-xs font-semibold tracking-wide text-white">
            Built for Bangladesh
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 text-balance text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
        >
          Technology That Saves Lives During Floods
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-4 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
        >
          FloodAid BD is a real-time flood information and emergency relief
          coordination platform designed to protect communities across
          Bangladesh.
        </motion.p>

        <div className="mt-8 flex flex-row items-center justify-center gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="w-40 rounded-xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-md"
          >
            <span className="block text-2xl font-bold text-white">10L+</span>
            <span className="mt-1 block text-xs text-white/60">
              People Affected Yearly
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="w-40 rounded-xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-md"
          >
            <span className="block text-2xl font-bold text-white">700+</span>
            <span className="mt-1 block text-xs text-white/60">
              Rivers in Bangladesh
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="size-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
