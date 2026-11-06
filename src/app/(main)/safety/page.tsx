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
import { useT } from "@/lib/i18n/use-t";

const EMERGENCY_CONTACTS = [
  { service: "National Emergency", serviceBn: "জাতীয় জরুরি সেবা", org: "Bangladesh Police", orgBn: "বাংলাদেশ পুলিশ", number: "999" },
  { service: "Flood Warning", serviceBn: "বন্যা সতর্কতা", org: "FFWC Hotline", orgBn: "FFWC হটলাইন", number: "10941" },
  { service: "Fire & Rescue", serviceBn: "আগুন ও উদ্ধার", org: "Fire Service", orgBn: "ফায়ার সার্ভিস", number: "199" },
  { service: "Health Emergency", serviceBn: "স্বাস্থ্য জরুরি সেবা", org: "DGHS Hotline", orgBn: "DGHS হটলাইন", number: "16263" },
];

const PHASES = [
  {
    icon: CloudRain,
    phase: "Before a Flood",
    phaseBn: "বন্যার আগে",
    tint: "text-info bg-info/10",
    tips: [
      "Keep an emergency kit ready: dry food, clean water, medicine, a torch, and a power bank.",
      "Know your nearest shelter and the safest route to reach it on higher ground.",
      "Store important documents in a waterproof bag or take clear photos on your phone.",
      "Charge all phones and power banks fully when a flood warning is issued.",
    ],
    tipsBn: [
      "শুকনো খাবার, বিশুদ্ধ পানি, ওষুধ, টর্চ ও পাওয়ার ব্যাংকসহ জরুরি ব্যাগ প্রস্তুত রাখুন।",
      "নিকটতম আশ্রয়কেন্দ্র এবং উঁচু ভূমি দিয়ে সেখানে যাওয়ার সবচেয়ে নিরাপদ পথ জেনে রাখুন।",
      "গুরুত্বপূর্ণ কাগজপত্র পানিরোধী ব্যাগে রাখুন বা ফোনে পরিষ্কার ছবি তুলে রাখুন।",
      "বন্যা সতর্কতা জারি হলে সব ফোন ও পাওয়ার ব্যাংক পুরোপুরি চার্জ করুন।",
    ],
  },
  {
    icon: Waves,
    phase: "During a Flood",
    phaseBn: "বন্যার সময়",
    tint: "text-destructive bg-destructive/10",
    tips: [
      "Move to the highest point available — rooftop, upper floor, or elevated ground.",
      "Never walk or swim through moving water; even 15 cm can knock you off your feet.",
      "Turn off electricity and gas if it is safe to reach the mains.",
      "Send an SOS with your GPS location and keep your phone on to receive updates.",
    ],
    tipsBn: [
      "যতটা সম্ভব উঁচু স্থানে যান—ছাদ, ওপরের তলা বা উঁচু ভূমি।",
      "স্রোতের পানিতে কখনো হাঁটবেন বা সাঁতার কাটবেন না; মাত্র ১৫ সেমি পানিও আপনাকে ফেলে দিতে পারে।",
      "নিরাপদে মূল সংযোগে পৌঁছানো গেলে বিদ্যুৎ ও গ্যাস বন্ধ করুন।",
      "GPS অবস্থানসহ SOS পাঠান এবং হালনাগাদ পেতে ফোন চালু রাখুন।",
    ],
  },
  {
    icon: Home,
    phase: "After a Flood",
    phaseBn: "বন্যার পরে",
    tint: "text-emerald-600 dark:text-emerald-500 bg-emerald-500/10",
    tips: [
      "Return home only when authorities declare it safe. Watch for weakened structures.",
      "Drink only boiled or bottled water; flood water is often contaminated.",
      "Avoid contact between flood water and open wounds to prevent infection.",
      "Document any damage with photos before cleaning up, for relief and insurance.",
    ],
    tipsBn: [
      "কর্তৃপক্ষ নিরাপদ ঘোষণা করার পরই বাড়ি ফিরুন। দুর্বল হয়ে যাওয়া স্থাপনার দিকে খেয়াল রাখুন।",
      "শুধু ফুটানো বা বোতলজাত পানি পান করুন; বন্যার পানি প্রায়ই দূষিত থাকে।",
      "সংক্রমণ এড়াতে খোলা ক্ষতের সঙ্গে বন্যার পানির সংস্পর্শ এড়িয়ে চলুন।",
      "পরিষ্কার করার আগে ত্রাণ ও বীমার জন্য ক্ষয়ক্ষতির ছবি তুলে রাখুন।",
    ],
  },
];

const DOS = [
  ["Listen to official flood warnings and evacuation orders", "সরকারি বন্যা সতর্কতা ও সরিয়ে নেওয়ার নির্দেশনা শুনুন"],
  ["Keep children and elderly members close and visible at all times", "শিশু ও বয়স্ক সদস্যদের সবসময় কাছে ও চোখের সামনে রাখুন"],
  ["Use a whistle or loud sounds to signal rescuers if stranded", "আটকে পড়লে বাঁশি বা জোরে শব্দ করে উদ্ধারকারীদের সংকেত দিন"],
  ["Help neighbours who may need assistance evacuating", "সরতে সহায়তা প্রয়োজন এমন প্রতিবেশীদের সাহায্য করুন"],
];

const DONTS = [
  ["Don't drive or walk through flooded roads", "প্লাবিত রাস্তায় গাড়ি চালাবেন বা হাঁটবেন না"],
  ["Don't touch electrical equipment if you are wet or in water", "আপনি ভেজা থাকলে বা পানিতে থাকলে বৈদ্যুতিক যন্ত্র স্পর্শ করবেন না"],
  ["Don't ignore evacuation orders to protect belongings", "জিনিসপত্র বাঁচাতে সরিয়ে নেওয়ার নির্দেশ অমান্য করবেন না"],
  ["Don't drink or cook with untreated flood water", "অপরিশোধিত বন্যার পানি পান বা রান্নায় ব্যবহার করবেন না"],
];

const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function SafetyPage() {
  const { tr, num, lang } = useT();
  return (
    <div className="bg-background">
      <PublicHero
        eyebrow={tr("Safety Guidelines", "নিরাপত্তা নির্দেশিকা")}
        breadcrumb={tr("Safety", "নিরাপত্তা")}
        icon={ShieldCheck}
        title={tr("Flood Safety, Before It's Too Late", "দেরি হওয়ার আগেই বন্যা নিরাপত্তা")}
        description={tr(
          "Practical, life-saving guidance for every stage of a flood — prepare early, act fast, and recover safely.",
          "বন্যার প্রতিটি পর্যায়ের ব্যবহারিক জীবনরক্ষাকারী নির্দেশনা—আগে প্রস্তুতি নিন, দ্রুত পদক্ষেপ নিন এবং নিরাপদে ঘুরে দাঁড়ান।",
        )}
      />

      {/* Emergency numbers band */}
      <section className="py-10 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-destructive" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {tr("Emergency Numbers — Toll-Free, 24/7", "জরুরি নম্বর—টোল-ফ্রি, ২৪/৭")}
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
                  <p className="text-xs font-semibold text-foreground truncate">{tr(c.service, c.serviceBn)}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{tr(c.org, c.orgBn)}</p>
                </div>
                <span className="text-lg font-mono font-extrabold text-destructive shrink-0">{num(c.number)}</span>
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
                    <h3 className="text-lg font-bold text-foreground">{tr(p.phase, p.phaseBn)}</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {(lang === "bn" ? p.tipsBn : p.tips).map((tip) => (
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
              <h3 className="text-base font-bold text-foreground">{tr("Do", "যা করবেন")}</h3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {DOS.map(([english, bangla]) => (
                <li key={english} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-500 mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  {tr(english, bangla)}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-destructive/15 text-destructive">
                <X className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-foreground">{tr("Don't", "যা করবেন না")}</h3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {DONTS.map(([english, bangla]) => (
                <li key={english} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-destructive mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  {tr(english, bangla)}
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
              {tr(
                "This guidance is general advice for flood-prone areas of Bangladesh. Always follow instructions from local authorities and the Flood Forecasting & Warning Centre (FFWC), which take precedence in any specific emergency.",
                "এই নির্দেশনা বাংলাদেশের বন্যাপ্রবণ এলাকার জন্য সাধারণ পরামর্শ। নির্দিষ্ট কোনো জরুরি অবস্থায় স্থানীয় কর্তৃপক্ষ এবং বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্রের (FFWC) নির্দেশনা সবসময় অগ্রাধিকার দিয়ে অনুসরণ করুন।",
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
