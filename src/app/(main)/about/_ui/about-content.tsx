"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Home,
  LifeBuoy,
  Megaphone,
  Package,
  PhoneOff,
  Quote,
  Radar,
  Siren,
  Users,
  Waves,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicSummary } from "@/lib/hooks/use-stats";
import { useT } from "@/lib/i18n/use-t";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={
        dark
          ? "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-lime"
          : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary"
      }
    >
      <span className={dark ? "h-1.5 w-1.5 rounded-full bg-lime" : "h-1.5 w-1.5 rounded-full bg-primary"} />
      {children}
    </span>
  );
}

function Hero() {
  const { tr } = useT();
  const promises = [
    ["Free for everyone", "সবার জন্য বিনামূল্যে"],
    ["No login needed for SOS", "SOS পাঠাতে লগইন লাগে না"],
    ["Bangla & English", "বাংলা ও ইংরেজি"],
  ] as const;
  return (
    <section className="relative overflow-hidden pt-32 md:pt-36">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.3_0.06_165/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.3_0.06_165/0.05)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_70%_60%_at_50%_30%,#000_40%,transparent_100%)]"
        aria-hidden
      />
      <div className="container relative mx-auto grid grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <Eyebrow>{tr("About FloodAid BD", "FloodAid BD পরিচিতি")}</Eyebrow>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {tr("Technology that saves lives", "জীবন রক্ষাকারী প্রযুক্তি")} {" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">{tr("during floods", "বন্যার সময়")}</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-lime md:h-4" aria-hidden />
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {tr(
              "FloodAid BD is a real-time flood information and emergency relief platform. It connects people in danger with shelters, rescuers and relief — in one place, at zero cost.",
              "FloodAid BD একটি রিয়েল-টাইম বন্যা তথ্য ও জরুরি সহায়তা প্ল্যাটফর্ম। এটি বিপদে থাকা মানুষকে আশ্রয়কেন্দ্র, উদ্ধারকারী ও ত্রাণের সঙ্গে এক জায়গায়, সম্পূর্ণ বিনামূল্যে যুক্ত করে।",
            )}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/sos" />} className="h-12 px-6">
              <Siren className="h-4 w-4 text-lime" />
              {tr("Get emergency help", "জরুরি সাহায্য নিন")}
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/how-it-works" />} className="h-12 px-6">
              {tr("How it works", "কীভাবে কাজ করে")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.ul variants={fadeUp} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-foreground/80">
            {promises.map(([english, bangla]) => (
              <li key={english} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {tr(english, bangla)}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] border border-border bg-muted sm:aspect-square">
            <Image
              src="/images/about/hero-flood.jpg"
              alt={tr("A family moving through flood water in a boat", "বন্যার পানিতে নৌকায় চলা একটি পরিবার")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent" />
            <span className="absolute bottom-4 left-5 text-[11px] text-white/80">
              {tr("Photo", "ছবি")}: Md shameem ul islam / Wikimedia Commons, CC BY 4.0
            </span>
          </div>
          <div className="absolute -left-4 top-10 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-lift sm:-left-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lime">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none text-foreground">{tr("10L+", "১০ লাখ+")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{tr("people affected yearly", "প্রতি বছর ক্ষতিগ্রস্ত মানুষ")}</p>
            </div>
          </div>
          <div className="absolute -right-3 bottom-16 flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-lift sm:-right-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime text-lime-foreground">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{tr("700+", "৭০০+")}</p>
              <p className="mt-1 text-xs text-white/70">{tr("rivers in Bangladesh", "বাংলাদেশের নদী")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ImpactStrip() {
  const { tr, num } = useT();
  const { data } = usePublicSummary();
  const items = [
    { label: tr("People sheltered right now", "এখন আশ্রয়ে থাকা মানুষ"), value: data?.peopleSheltered, icon: Home },
    { label: tr("Shelters open", "খোলা আশ্রয়কেন্দ্র"), value: data?.sheltersOpen, icon: LifeBuoy },
    { label: tr("Rescues completed", "সম্পন্ন উদ্ধার"), value: data?.sosResolved, icon: Siren },
    { label: tr("Verified volunteers", "যাচাইকৃত স্বেচ্ছাসেবক"), value: data?.verifiedVolunteers, icon: Users },
  ];
  return (
    <section className="container mx-auto my-6 px-4 sm:px-6 md:my-20 lg:px-8">
      <div className="grid grid-cols-2 overflow-hidden rounded-[2rem] bg-primary text-primary-foreground lg:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.label}
            className={`flex flex-col gap-3 p-6 md:p-8 ${i > 0 ? "lg:border-l" : ""} ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} border-white/10`}
          >
            <it.icon className="h-6 w-6 text-lime" />
            <p className="text-3xl font-bold tracking-tight md:text-4xl tabular-nums">
              {it.value !== undefined ? num(it.value) : "—"}
            </p>
            <p className="text-sm text-white/65">{it.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {tr("Live numbers from the FloodAid platform", "FloodAid প্ল্যাটফর্মের সরাসরি পরিসংখ্যান")}
      </p>
    </section>
  );
}

function Mission() {
  const { tr } = useT();
  const values = [
    ["Real-time", "রিয়েল-টাইম", "Live alerts and shelter capacity", "সরাসরি সতর্কতা ও আশ্রয়কেন্দ্রের ধারণক্ষমতা"],
    ["Zero cost", "সম্পূর্ণ বিনামূল্যে", "Free for every citizen", "প্রত্যেক নাগরিকের জন্য বিনামূল্যে"],
    ["Open source", "ওপেন সোর্স", "Built in the open", "উন্মুক্তভাবে নির্মিত"],
  ] as const;
  return (
    <section className="container mx-auto my-6 px-4 sm:px-6 md:my-20 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-[2rem] border border-border bg-muted">
            <Image
              src="/images/about/mission.jpg"
              alt={tr("Flood-affected family keeping their belongings dry", "বন্যায় ক্ষতিগ্রস্ত একটি পরিবার তাদের জিনিসপত্র শুকনো রাখছে")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <figure className="relative -mt-16 ml-auto mr-4 max-w-sm rounded-2xl border border-border bg-card p-5 shadow-lift sm:mr-8">
            <Quote className="h-6 w-6 text-primary" />
            <blockquote className="mt-2 text-sm italic leading-relaxed text-foreground/85">
              {tr(
                "“When the water came, we had nowhere to go. A platform like this could have saved us hours of panic.”",
                "“পানি আসার পর আমাদের যাওয়ার কোনো জায়গা ছিল না। এমন একটি প্ল্যাটফর্ম থাকলে আতঙ্কের অনেকটা সময় বাঁচত।”",
              )}
            </blockquote>
            <figcaption className="mt-3 text-xs font-semibold text-muted-foreground">
              {tr("— Flood survivor, Feni 2024", "— বন্যা থেকে বেঁচে ফেরা ব্যক্তি, ফেনী ২০২৪")}
            </figcaption>
          </figure>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <Eyebrow>{tr("Our mission", "আমাদের লক্ষ্য")}</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-5 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {tr("No one should face a flood alone", "বন্যার মোকাবিলা কাউকে একা করতে হবে না")}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {tr(
              "Every monsoon season, millions of Bangladeshi families face the same terrifying uncertainty — rising water, no information, no shelter, no help in sight. We believe technology built with empathy can bridge the gap between people in danger and people who can help.",
              "প্রতি বর্ষায় বাংলাদেশের লাখো পরিবার একই ভয়াবহ অনিশ্চয়তার মুখোমুখি হয়—পানি বাড়ছে, তথ্য নেই, আশ্রয় নেই, সাহায্যেরও দেখা নেই। আমরা বিশ্বাস করি, সহমর্মিতা দিয়ে তৈরি প্রযুক্তি বিপদে থাকা মানুষ ও সাহায্য করতে সক্ষম মানুষের মধ্যকার দূরত্ব কমাতে পারে।",
            )}
          </motion.p>
          <motion.div variants={stagger} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {values.map(([title, titleBn, text, textBn]) => (
              <motion.div key={title} variants={fadeUp} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-base font-bold text-foreground">{tr(title, titleBn)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{tr(text, textBn)}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const FACTS = [
  { value: "20–30%", valueBn: "২০–৩০%", label: "of Bangladesh floods every year", labelBn: "বাংলাদেশের অংশ প্রতি বছর প্লাবিত হয়" },
  { value: "700+", valueBn: "৭০০+", label: "rivers across the country", labelBn: "সারা দেশের নদী" },
  { value: "10M+", valueBn: "১ কোটির বেশি", label: "people affected each monsoon", labelBn: "প্রতি বর্ষায় ক্ষতিগ্রস্ত মানুষ" },
  { value: "~$2B", valueBn: "প্রায় ২০০ কোটি ডলার", label: "economic damage per year", labelBn: "প্রতি বছরের অর্থনৈতিক ক্ষতি" },
];

const PROBLEMS = [
  {
    icon: WifiOff,
    title: "No centralised information",
    titleBn: "কেন্দ্রীয় তথ্যের অভাব",
    text: "Flood data is scattered across government sites, social media and word of mouth. Rural communities often learn the water level too late.",
    textBn: "বন্যার তথ্য সরকারি ওয়েবসাইট, সামাজিক যোগাযোগমাধ্যম ও মুখে মুখে ছড়িয়ে থাকে। গ্রামীণ জনগোষ্ঠী প্রায়ই পানির উচ্চতা সম্পর্কে অনেক দেরিতে জানতে পারে।",
    result: "Delayed evacuations cost lives",
    resultBn: "দেরিতে সরলে প্রাণহানি ঘটে",
  },
  {
    icon: Home,
    title: "Shelter chaos",
    titleBn: "আশ্রয়কেন্দ্র নিয়ে বিশৃঙ্খলা",
    text: "People don't know where shelters are, whether they have space, or what facilities exist — families wade through chest-deep water searching.",
    textBn: "আশ্রয়কেন্দ্র কোথায়, জায়গা আছে কি না বা কী সুবিধা আছে—মানুষ তা জানে না; পরিবারগুলো বুকসমান পানি পেরিয়ে খুঁজতে থাকে।",
    result: "Overcrowded shelters, empty ones nearby",
    resultBn: "কোথাও অতিরিক্ত ভিড়, কাছের কেন্দ্র ফাঁকা",
  },
  {
    icon: PhoneOff,
    title: "No rescue coordination",
    titleBn: "উদ্ধার সমন্বয়ের অভাব",
    text: "Stranded people rely on calls to relatives or social posts. There is no structured way to send a GPS rescue request and track it.",
    textBn: "আটকে পড়া মানুষ আত্মীয়কে ফোন বা সামাজিক যোগাযোগমাধ্যমের পোস্টের ওপর নির্ভর করেন। GPS-সহ উদ্ধার অনুরোধ পাঠানো ও ট্র্যাক করার কাঠামোবদ্ধ উপায় নেই।",
    result: "Duplicated efforts, missed rescues",
    resultBn: "একই কাজের পুনরাবৃত্তি, উদ্ধার বাদ পড়া",
  },
];

function Challenge() {
  const { tr } = useT();
  return (
    <section className="my-6 md:my-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-night px-6 py-12 text-white md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lime/10 blur-3xl" aria-hidden />
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Eyebrow dark>{tr("The challenge", "বর্তমান চ্যালেঞ্জ")}</Eyebrow>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
                {tr("Bangladesh faces devastating floods every year", "বাংলাদেশ প্রতি বছর ভয়াবহ বন্যার মুখোমুখি হয়")}
              </h2>
              <p className="mt-5 text-white/65 md:text-lg">
                {tr(
                  "And the systems meant to help are failing the people who need them most.",
                  "কিন্তু সহায়তার জন্য তৈরি ব্যবস্থাগুলো সবচেয়ে প্রয়োজনের সময় মানুষের কাছে পৌঁছাতে পারছে না।",
                )}
              </p>
              <div className="relative mt-8 aspect-4/3 overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src="/images/about/problem-water.jpg"
                  alt={tr("People collecting drinking water during a flood", "বন্যার সময় পানীয় পানি সংগ্রহ করছেন মানুষ")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-4 pt-12">
                  <p className="text-sm font-medium">
                    {tr(
                      "Clean water becomes the scarcest resource — even standing in it.",
                      "চারদিকে পানি থাকলেও বিশুদ্ধ পানিই হয়ে ওঠে সবচেয়ে দুর্লভ সম্পদ।",
                    )}
                  </p>
                  <p className="mt-1 text-[11px] text-white/60">Md shameem ul islam / Wikimedia Commons, CC BY 4.0</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-3">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
                {FACTS.map((f) => (
                  <div key={f.label} className="bg-night p-5 md:p-6">
                    <p className="text-3xl font-extrabold text-lime md:text-4xl">{tr(f.value, f.valueBn)}</p>
                    <p className="mt-1.5 text-sm text-white/65">{tr(f.label, f.labelBn)}</p>
                  </div>
                ))}
              </div>
              {PROBLEMS.map((p) => (
                <div key={p.title} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lime">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{tr(p.title, p.titleBn)}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">{tr(p.text, p.textBn)}</p>
                    <p className="mt-3 inline-flex rounded-full bg-[oklch(0.64_0.22_22/0.18)] px-3 py-1 text-xs font-semibold text-[oklch(0.82_0.11_22)]">
                      {tr(p.result, p.resultBn)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const MODULES = [
  { icon: Radar, title: "Real-time flood alerts", titleBn: "রিয়েল-টাইম বন্যা সতর্কতা", text: "District water monitoring with five severity levels — know before water reaches your door.", textBn: "পাঁচটি বিপদমাত্রায় জেলার পানি পর্যবেক্ষণ—পানি ঘরে পৌঁছানোর আগেই জানুন।", href: "/alerts", big: true },
  { icon: Home, title: "Shelter finder", titleBn: "আশ্রয়কেন্দ্র খোঁজার ব্যবস্থা", text: "Live capacity, facilities and GPS directions on an interactive map.", textBn: "ইন্টার‌্যাকটিভ মানচিত্রে সরাসরি ধারণক্ষমতা, সুযোগ-সুবিধা ও GPS দিকনির্দেশনা।", href: "/shelters" },
  { icon: Siren, title: "Emergency SOS", titleBn: "জরুরি SOS", text: "A GPS rescue request in one tap, tracked live as volunteers respond.", textBn: "এক ট্যাপে GPS-সহ উদ্ধার অনুরোধ; স্বেচ্ছাসেবকের সাড়াদান সরাসরি ট্র্যাক করুন।", href: "/sos", dark: true },
  { icon: Package, title: "Relief tracker", titleBn: "ত্রাণ ট্র্যাকার", text: "See where relief went and where it hasn't — no duplication.", textBn: "কোথায় ত্রাণ গেছে আর কোথায় যায়নি দেখুন—একই জায়গায় পুনরাবৃত্তি নয়।", href: "/how-it-works" },
  { icon: Users, title: "Volunteer coordination", titleBn: "স্বেচ্ছাসেবক সমন্বয়", text: "Register, get assigned to rescues and coordinate as a team.", textBn: "নিবন্ধন করুন, উদ্ধারকাজের দায়িত্ব নিন এবং দল হিসেবে সমন্বয় করুন।", href: "/get-involved" },
  { icon: BarChart3, title: "Reports & analytics", titleBn: "রিপোর্ট ও বিশ্লেষণ", text: "Resolution rates, coverage and exportable reports for authorities.", textBn: "কর্তৃপক্ষের জন্য সমাধানের হার, আওতা ও ডাউনলোডযোগ্য রিপোর্ট।", href: "/how-it-works" },
];

function Platform() {
  const { tr } = useT();
  return (
    <section className="container mx-auto my-6 px-4 sm:px-6 md:my-20 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Eyebrow>{tr("Our solution", "আমাদের সমাধান")}</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {tr("A complete flood response platform", "একটি পূর্ণাঙ্গ বন্যা মোকাবিলা প্ল্যাটফর্ম")}
          </h2>
        </div>
        <p className="max-w-md text-muted-foreground md:text-lg">
          {tr(
            "Six integrated modules working together — before, during and after a flood.",
            "বন্যার আগে, সময়ে ও পরে ছয়টি সমন্বিত মডিউল একসঙ্গে কাজ করে।",
          )}
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {MODULES.map((m) => (
          <motion.div key={m.title} variants={fadeUp} className={m.big ? "md:col-span-2 lg:row-span-2" : ""}>
            <Link
              href={m.href}
              className={`group flex h-full flex-col justify-between gap-8 rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lift ${
                m.dark
                  ? "border-primary bg-primary text-primary-foreground"
                  : m.big
                    ? "border-border bg-accent"
                    : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex items-center justify-center rounded-2xl ${m.big ? "h-16 w-16" : "h-12 w-12"} ${
                    m.dark ? "bg-lime text-lime-foreground" : "bg-primary text-lime"
                  }`}
                >
                  <m.icon className={m.big ? "h-8 w-8" : "h-6 w-6"} />
                </div>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                    m.dark
                      ? "border-white/20 group-hover:bg-lime group-hover:text-lime-foreground"
                      : "border-border group-hover:bg-primary group-hover:text-lime"
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className={`font-bold ${m.big ? "text-2xl md:text-3xl" : "text-lg"}`}>{tr(m.title, m.titleBn)}</h3>
                <p className={`mt-2 leading-relaxed ${m.big ? "text-base" : "text-sm"} ${m.dark ? "text-white/70" : "text-muted-foreground"}`}>
                  {tr(m.text, m.textBn)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-4 rounded-3xl border border-dashed border-primary/30 bg-card p-6 lg:col-span-3"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime text-lime-foreground">
            <Megaphone className="h-6 w-6" />
          </div>
          <p className="text-sm text-foreground/80 md:text-base">
            {tr(
              "All six modules are connected — an alert in one district highlights nearby shelters, notifies registered volunteers and flags areas that need relief.",
              "ছয়টি মডিউলই পরস্পর যুক্ত—কোনো জেলায় সতর্কতা এলে কাছের আশ্রয়কেন্দ্র দেখায়, নিবন্ধিত স্বেচ্ছাসেবকদের জানায় এবং ত্রাণ প্রয়োজন এমন এলাকা চিহ্নিত করে।",
            )}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

const FLOW = [
  { icon: Radar, title: "Alert issued", titleBn: "সতর্কতা জারি", text: "Admins post a flood alert for a district.", textBn: "অ্যাডমিন একটি জেলার জন্য বন্যা সতর্কতা প্রকাশ করেন।" },
  { icon: Home, title: "Shelters found", titleBn: "আশ্রয়কেন্দ্র পাওয়া", text: "Citizens see the nearest open shelters.", textBn: "নাগরিকরা কাছের খোলা আশ্রয়কেন্দ্র দেখতে পান।" },
  { icon: Siren, title: "SOS sent", titleBn: "SOS পাঠানো", text: "Stranded people request rescue with GPS.", textBn: "আটকে পড়া মানুষ GPS-সহ উদ্ধার অনুরোধ পাঠান।" },
  { icon: LifeBuoy, title: "Rescue & relief", titleBn: "উদ্ধার ও ত্রাণ", text: "Volunteers rescue and deliver supplies.", textBn: "স্বেচ্ছাসেবকেরা উদ্ধার করেন ও প্রয়োজনীয় সামগ্রী পৌঁছে দেন।" },
];

function Flow() {
  const { tr, num } = useT();
  return (
    <section className="container mx-auto my-6 px-4 sm:px-6 md:my-20 lg:px-8">
      <div className="text-center">
        <Eyebrow>{tr("How a response flows", "সাড়াদান যেভাবে এগোয়")}</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
          {tr("From the first warning to a family rescued", "প্রথম সতর্কতা থেকে একটি পরিবারের উদ্ধার পর্যন্ত")}
        </h2>
      </div>
      <ol className="relative mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-[12%] right-[12%] top-8 hidden h-px border-t-2 border-dashed border-primary/25 lg:block" aria-hidden />
        {FLOW.map((f, i) => (
          <li key={f.title} className="relative flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center">
            <div className="relative -mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lime ring-8 ring-background">
              <f.icon className="h-7 w-7" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-lime text-[11px] font-black text-lime-foreground">
                {num(i + 1)}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground">{tr(f.title, f.titleBn)}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{tr(f.text, f.textBn)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Cta() {
  const { tr } = useT();
  return (
    <section className="container mx-auto my-6 px-4 sm:px-6 md:my-20 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-12 text-center text-primary-foreground md:py-16">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full border border-white/10" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full border border-white/10" aria-hidden />
        <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
          {tr("Be the help someone is waiting for", "কারও প্রতীক্ষিত সাহায্য হয়ে উঠুন")}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/70 md:text-lg">
          {tr(
            "Join as a volunteer, or share FloodAid with your community before the next monsoon.",
            "স্বেচ্ছাসেবক হিসেবে যোগ দিন, অথবা আগামী বর্ষার আগে আপনার কমিউনিটিতে FloodAid-এর কথা ছড়িয়ে দিন।",
          )}
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/get-involved" />} className="h-12 bg-lime px-6 text-lime-foreground hover:bg-lime/90">
            {tr("Become a volunteer", "স্বেচ্ছাসেবক হোন")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/safety" />}
            className="h-12 border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
          >
            {tr("Read safety guide", "নিরাপত্তা নির্দেশিকা পড়ুন")}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function AboutContent() {
  return (
    <div className="pb-6 md:pb-10">
      <Hero />
      <ImpactStrip />
      <Mission />
      <Challenge />
      <Platform />
      <Flow />
      <Cta />
    </div>
  );
}
