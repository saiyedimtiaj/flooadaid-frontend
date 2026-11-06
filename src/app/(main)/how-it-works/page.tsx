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
import { useT } from "@/lib/i18n/use-t";

const STEPS = [
  {
    icon: Radar,
    title: "Check Flood Alerts",
    titleBn: "বন্যা সতর্কতা দেখুন",
    description:
      "See real-time water levels and severity alerts for your district on an interactive map. Know before the water reaches you.",
    descriptionBn: "ইন্টার‌্যাকটিভ মানচিত্রে আপনার জেলার সরাসরি পানির উচ্চতা ও বিপদমাত্রা দেখুন। পানি পৌঁছানোর আগেই জেনে নিন।",
    tint: "text-destructive bg-destructive/10",
  },
  {
    icon: MapPin,
    title: "Find the Nearest Shelter",
    titleBn: "নিকটতম আশ্রয়কেন্দ্র খুঁজুন",
    description:
      "Locate open emergency shelters with live capacity, facilities (food, water, medical), and GPS directions — sorted by distance.",
    descriptionBn: "দূরত্ব অনুযায়ী সাজানো খোলা জরুরি আশ্রয়কেন্দ্রের সরাসরি ধারণক্ষমতা, খাবার-পানি-চিকিৎসা সুবিধা ও GPS দিকনির্দেশনা দেখুন।",
    tint: "text-primary bg-primary/10",
  },
  {
    icon: Siren,
    title: "Send an Emergency SOS",
    titleBn: "জরুরি SOS পাঠান",
    description:
      "One tap sends a GPS-located rescue request with your details. No account needed — help is dispatched to your exact location.",
    descriptionBn: "এক ট্যাপে আপনার তথ্য ও GPS অবস্থানসহ উদ্ধার অনুরোধ পাঠান। অ্যাকাউন্ট লাগে না—আপনার সঠিক অবস্থানে সাহায্য পাঠানো হবে।",
    tint: "text-amber-600 dark:text-amber-500 bg-amber-500/10",
  },
  {
    icon: LifeBuoy,
    title: "Get Rescued & Track It",
    titleBn: "উদ্ধার পান ও ট্র্যাক করুন",
    description:
      "A volunteer or rescue team is assigned to your request. Track the status live from pending to rescued, right from your phone.",
    descriptionBn: "আপনার অনুরোধে একজন স্বেচ্ছাসেবক বা উদ্ধারকারী দল নিযুক্ত হবে। ফোন থেকেই অপেক্ষমাণ অবস্থা থেকে উদ্ধার পর্যন্ত সরাসরি ট্র্যাক করুন।",
    tint: "text-emerald-600 dark:text-emerald-500 bg-emerald-500/10",
  },
];

const PATHS = [
  {
    icon: UserRound,
    role: "For Residents",
    roleBn: "বাসিন্দাদের জন্য",
    description: "Check alerts, find shelters, and send SOS requests during a flood — no sign-up required to get help.",
    descriptionBn: "বন্যার সময় সতর্কতা দেখুন, আশ্রয়কেন্দ্র খুঁজুন ও SOS পাঠান—সাহায্য পেতে সাইন আপ লাগে না।",
    href: "/sos",
    cta: "Send an SOS",
    ctaBn: "SOS পাঠান",
  },
  {
    icon: HeartHandshake,
    role: "For Volunteers",
    roleBn: "স্বেচ্ছাসেবকদের জন্য",
    description: "Register your skills and district, get verified, and receive nearby rescue assignments to coordinate response.",
    descriptionBn: "দক্ষতা ও জেলা নিবন্ধন করে যাচাই সম্পন্ন করুন এবং কাছাকাছি উদ্ধারকাজের দায়িত্ব নিন।",
    href: "/get-involved",
    cta: "Become a Volunteer",
    ctaBn: "স্বেচ্ছাসেবক হোন",
  },
  {
    icon: ShieldCheck,
    role: "For Authorities",
    roleBn: "কর্তৃপক্ষের জন্য",
    description: "Post district alerts, manage shelters, assign volunteers, log relief, and export situation reports.",
    descriptionBn: "জেলা সতর্কতা প্রকাশ, আশ্রয়কেন্দ্র পরিচালনা, স্বেচ্ছাসেবক নিয়োগ, ত্রাণ নথিভুক্ত ও পরিস্থিতি রিপোর্ট ডাউনলোড করুন।",
    href: "/login",
    cta: "Admin Sign In",
    ctaBn: "অ্যাডমিন সাইন ইন",
  },
];

const FAQS = [
  {
    q: "Do I need an account to send an SOS?",
    qBn: "SOS পাঠাতে কি অ্যাকাউন্ট দরকার?",
    a: "No. The emergency SOS form is fully public — just share your location and details, and rescuers are notified. You'll get a tracking ID to check your request's status later.",
    aBn: "না। জরুরি SOS ফর্মটি সবার জন্য উন্মুক্ত—শুধু অবস্থান ও বিস্তারিত তথ্য দিন, উদ্ধারকারীদের জানানো হবে। পরে অনুরোধের অবস্থা দেখতে একটি ট্র্যাকিং আইডি পাবেন।",
  },
  {
    q: "How current is the flood and shelter data?",
    qBn: "বন্যা ও আশ্রয়কেন্দ্রের তথ্য কতটা হালনাগাদ?",
    a: "Alerts, shelter capacity, and SOS requests are live from our backend. Admins update them in real time, and the pages auto-refresh so you always see the latest state.",
    aBn: "সতর্কতা, আশ্রয়কেন্দ্রের ধারণক্ষমতা ও SOS অনুরোধ সরাসরি সার্ভার থেকে আসে। অ্যাডমিনরা তাৎক্ষণিক হালনাগাদ করেন এবং পেজ নিজে থেকে রিফ্রেশ হয়ে সর্বশেষ অবস্থা দেখায়।",
  },
  {
    q: "Is FloodAid BD free to use?",
    qBn: "FloodAid BD ব্যবহার কি বিনামূল্যে?",
    a: "Yes, entirely free. It's built as a humanitarian tool for communities across Bangladesh.",
    aBn: "হ্যাঁ, সম্পূর্ণ বিনামূল্যে। এটি বাংলাদেশের সব কমিউনিটির জন্য একটি মানবিক সহায়তা ব্যবস্থা হিসেবে তৈরি।",
  },
  {
    q: "How do I become a volunteer?",
    qBn: "আমি কীভাবে স্বেচ্ছাসেবক হব?",
    a: "Sign up, then complete your volunteer profile with your skills, district, and availability. Once an admin verifies you, you can be assigned to nearby SOS requests.",
    aBn: "সাইন আপ করে আপনার দক্ষতা, জেলা ও সময় দেওয়ার তথ্যসহ স্বেচ্ছাসেবক প্রোফাইল সম্পূর্ণ করুন। অ্যাডমিন যাচাই করলে কাছাকাছি SOS অনুরোধে আপনাকে নিযুক্ত করা যাবে।",
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
  const { tr, num, lang } = useT();
  return (
    <div className="bg-background">
      <PublicHero
        eyebrow={tr("How It Works", "কীভাবে কাজ করে")}
        breadcrumb={tr("How It Works", "কীভাবে কাজ করে")}
        icon={Workflow}
        title={tr("From First Alert to Safe & Rescued", "প্রথম সতর্কতা থেকে নিরাপদ উদ্ধার পর্যন্ত")}
        description={tr(
          "FloodAid BD connects people in danger with the information, shelter, and rescue they need — in four simple steps.",
          "FloodAid BD চারটি সহজ ধাপে বিপদে থাকা মানুষকে প্রয়োজনীয় তথ্য, আশ্রয় ও উদ্ধারের সঙ্গে যুক্ত করে।",
        )}
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
                        {lang === "bn" ? `০${num(i + 1)}` : String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-foreground">{tr(step.title, step.titleBn)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tr(step.description, step.descriptionBn)}</p>
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
              {tr("Built for Everyone in the Response", "বন্যা মোকাবিলায় সবার জন্য তৈরি")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {tr(
                "Whether you need help, want to help, or coordinate the response — there's a path for you.",
                "আপনার সাহায্য দরকার, আপনি সাহায্য করতে চান, অথবা সাড়াদান সমন্বয় করেন—সবার জন্যই এখানে একটি পথ আছে।",
              )}
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
                    <h3 className="text-base font-bold text-foreground">{tr(path.role, path.roleBn)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                      {tr(path.description, path.descriptionBn)}
                    </p>
                    <Link
                      href={path.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      {tr(path.cta, path.ctaBn)}
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
              {tr("Frequently Asked Questions", "সচরাচর জিজ্ঞাসিত প্রশ্ন")}
            </h2>
          </div>
          <Accordion>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q}>
                <AccordionTrigger>{tr(faq.q, faq.qBn)}</AccordionTrigger>
                <AccordionPanel>{tr(faq.a, faq.aBn)}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <Button size="xl" className="font-bold gap-2" nativeButton={false} render={<Link href="/sos" className="flex items-center gap-2" />}>
                <Siren className="h-5 w-5" />
                {tr("Get Help Now", "এখনই সাহায্য নিন")}
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
