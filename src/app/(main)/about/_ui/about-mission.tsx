"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function AboutMission() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col"
          >
            <motion.div variants={textVariants} className="flex items-center">
              <span className="w-10 h-0.5 bg-primary rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary ml-3">
                Our Mission
              </span>
            </motion.div>

            <motion.h2
              variants={textVariants}
              className="mt-4 text-2xl md:text-3xl font-bold text-foreground leading-snug text-balance"
            >
              No one should face a flood alone
            </motion.h2>

            <motion.p
              variants={textVariants}
              className="mt-4 text-base text-muted-foreground leading-relaxed"
            >
              Every monsoon season, millions of Bangladeshi families face the
              same terrifying uncertainty — rising water, no information, no
              shelter, no help in sight. FloodAid BD exists to change that. We
              believe that technology, when built with empathy and purpose, can
              bridge the gap between people in danger and people who can help.
            </motion.p>

            <motion.p
              variants={textVariants}
              className="mt-4 text-base text-muted-foreground leading-relaxed"
            >
              Our vision is a Bangladesh where no flood-affected person is left
              without information, shelter, or rescue — where every community
              has real-time access to the tools they need to survive and
              recover.
            </motion.p>

            <motion.div
              variants={textVariants}
              className="mt-6 flex flex-row flex-wrap gap-2"
            >
              <motion.span
                variants={pillVariants}
                className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
              >
                Real-time Information
              </motion.span>
              <motion.span
                variants={pillVariants}
                className="bg-success/10 text-success rounded-full px-3 py-1 text-xs font-medium"
              >
                Zero Cost
              </motion.span>
              <motion.span
                variants={pillVariants}
                className="bg-info/10 text-info rounded-full px-3 py-1 text-xs font-medium"
              >
                Open Source
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="relative pb-6 lg:pb-0">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative aspect-4/3 rounded-2xl overflow-hidden ring-1 ring-border shadow-lg"
            >
              {imageError ? (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                  <Heart className="size-16 text-primary/20" />
                </div>
              ) : (
                <>
                  <Image
                    src="/images/about/mission.jpg"
                    alt="A boy in floodwater holds his schoolbook above the water to keep it dry"
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                  <span className="absolute bottom-2 right-2.5 text-[9px] text-white/70 drop-shadow-sm">
                    Md shameem ul islam / CC BY 4.0
                  </span>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="absolute left-1/2 -translate-x-1/2 -bottom-6 md:left-auto md:right-4 md:translate-x-0 lg:-bottom-6 lg:-right-6 w-full max-w-[260px] rounded-xl p-4 bg-background shadow-lg border z-10"
            >
              <span className="block text-3xl font-serif text-primary/20 leading-none">
                &ldquo;
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed italic mt-1">
                When the water came, we had nowhere to go. A platform like this
                could have saved us hours of panic.
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                &mdash; Flood survivor, Feni 2024
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
