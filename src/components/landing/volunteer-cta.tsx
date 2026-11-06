"use client";

import { Heart, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePublicVolunteerStats } from "@/lib/hooks/use-volunteers";
import { usePublicSosStats } from "@/lib/hooks/use-sos";
import { useT } from "@/lib/i18n/use-t";

export default function VolunteerCTA() {
  const { tr, num, lang } = useT();
  const { data: volunteerStats } = usePublicVolunteerStats();
  const { data: sosStats } = usePublicSosStats();

  const stats = [
    { value: num(volunteerStats?.total ?? 0), label: tr("Active Volunteers", "সক্রিয় স্বেচ্ছাসেবক") },
    { value: num(sosStats?.resolved ?? 0), label: tr("Rescues Completed", "সম্পন্ন উদ্ধার") },
    { value: num(volunteerStats?.districtsCovered ?? 0), label: tr("Districts Covered", "অন্তর্ভুক্ত জেলা") },
  ];

  const volunteerCount = volunteerStats?.total ?? 0;

  return (
    <section className="relative w-full my-6 md:my-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full rounded-[2.5rem] overflow-hidden py-12 px-6 md:py-16 md:px-12 lg:py-20 lg:px-16 bg-brand shadow-lift"
        >
          <div className="absolute inset-0 z-0 pointer-events-none bg-dots opacity-40" aria-hidden="true" />
          <div className="absolute -right-24 -top-24 z-0 h-96 w-96 rounded-full bg-brand-cyan/50 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-24 -bottom-32 z-0 h-96 w-96 rounded-full bg-brand-indigo/60 blur-3xl" aria-hidden="true" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 relative z-10 items-center">
            <motion.div
              className="lg:col-span-3 flex flex-col items-start text-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-xs select-none">
                <Heart className="h-3 w-3 text-white fill-white shrink-0" />
                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">
                  {tr("Join the Movement", "মানবিক উদ্যোগে যোগ দিন")}
                </span>
                <motion.div
                  className="absolute inset-y-0 -left-1/2 w-1/3 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                  initial={{ x: "-20%" }}
                  animate={{ x: "220%" }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                />
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mt-4 text-balance">
                {tr("Every Hand Counts When the Water Rises", "পানি বাড়লে প্রতিটি সাহায্যের হাত গুরুত্বপূর্ণ")}
              </h2>

              <p className="text-sm md:text-base lg:text-lg text-white/80 leading-relaxed mt-4 max-w-lg">
                {lang === "bn"
                  ? volunteerCount > 0
                    ? `${num(volunteerCount)} জন স্বেচ্ছাসেবক ইতিমধ্যে ${num(volunteerStats?.districtsCovered ?? 0)}টি জেলায় উদ্ধার সমন্বয়, ত্রাণ বিতরণ ও আশ্রয়কেন্দ্র পরিচালনায় সহায়তা করছেন।`
                    : "প্রথম দিকের স্বেচ্ছাসেবকদের একজন হোন—উদ্ধার সমন্বয়, ত্রাণ বিতরণ ও আশ্রয়কেন্দ্র পরিচালনায় সহায়তা করুন।"
                  : volunteerCount > 0
                    ? `${volunteerCount} volunteer${volunteerCount === 1 ? "" : "s"} ${volunteerCount === 1 ? "is" : "are"} already helping across ${volunteerStats?.districtsCovered ?? 0} district${volunteerStats?.districtsCovered === 1 ? "" : "s"} — coordinating rescues, distributing relief, and managing shelters.`
                    : "Be one of the first to help — coordinating rescues, distributing relief, and managing shelters."}{" "}
                {tr(
                  "Your skills can save lives. Register in under a minute.",
                  "আপনার দক্ষতা জীবন বাঁচাতে পারে। এক মিনিটেরও কম সময়ে নিবন্ধন করুন।",
                )}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 md:mt-8 w-full sm:w-auto">
                <Button
                  className="bg-white text-foreground hover:bg-white/90 font-bold transition-all duration-200 shadow-md group shrink-0"
                  variant={"ghost"} nativeButton={false} render={<Link href="/get-involved" className="flex items-center gap-1.5" />}>
                    <Users className="h-4 w-4 mr-2 text-primary shrink-0 transition-transform duration-300 group-hover:scale-105" />
                    {tr("Register as Volunteer", "স্বেচ্ছাসেবক হিসেবে নিবন্ধন")}
                  </Button>

                <Button
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white font-bold transition-all duration-200 shrink-0" nativeButton={false} render={<Link href="/how-it-works" className="flex items-center gap-1.5" />}>
                    {tr("Learn More", "আরও জানুন")}
                    <ArrowRight className="h-4 w-4 ml-2 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
              </div>
            </motion.div>

            <div className="hidden lg:col-span-2 lg:flex flex-col gap-8 pl-6 border-l border-white/10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-start"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight tabular-nums select-none">
                    {stat.value}
                  </span>
                  <div className="w-12 h-0.5 bg-white/20 mt-2" />
                  <span className="text-xs font-bold text-white/60 mt-2 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
