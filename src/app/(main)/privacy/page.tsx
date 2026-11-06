"use client";

import { ShieldCheck } from "lucide-react";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";
import { useT } from "@/lib/i18n/use-t";

type Translate = (english: string, bangla: string) => string;

const getSections = (tr: Translate): LegalSection[] => [
  {
    id: "overview",
    heading: tr("Overview", "সারসংক্ষেপ"),
    body: (
      <p>
        {tr(
          "FloodAid BD is a humanitarian flood-response platform. We collect the minimum information needed to deliver alerts, connect people to shelters, and coordinate rescue — nothing more. This policy explains what we collect, why, and the choices you have.",
          "FloodAid BD একটি মানবিক বন্যা মোকাবিলা প্ল্যাটফর্ম। সতর্কতা পৌঁছানো, মানুষকে আশ্রয়কেন্দ্রের সঙ্গে যুক্ত করা এবং উদ্ধার সমন্বয়ের জন্য যতটুকু তথ্য দরকার, আমরা শুধু ততটুকুই সংগ্রহ করি। কী তথ্য নিই, কেন নিই এবং আপনার কী কী পছন্দ আছে—এই নীতিতে তা ব্যাখ্যা করা হয়েছে।",
        )}
      </p>
    ),
  },
  {
    id: "collect",
    heading: tr("Information We Collect", "আমরা যে তথ্য সংগ্রহ করি"),
    body: (
      <>
        <p>{tr("Depending on how you use FloodAid, we may collect:", "আপনি FloodAid কীভাবে ব্যবহার করেন তার ওপর নির্ভর করে আমরা সংগ্রহ করতে পারি:")}</p>
        <ul>
          <li><strong>{tr("Account details", "অ্যাকাউন্টের তথ্য")}</strong> — {tr("your name, email, phone, and role, if you register.", "নিবন্ধন করলে আপনার নাম, ইমেইল, ফোন ও ভূমিকা।")}</li>
          <li><strong>{tr("SOS requests", "SOS অনুরোধ")}</strong> — {tr("your name, phone, GPS location, and situation details, so rescuers can reach you.", "আপনার নাম, ফোন, GPS অবস্থান ও পরিস্থিতির বিবরণ, যাতে উদ্ধারকারীরা আপনার কাছে পৌঁছাতে পারেন।")}</li>
          <li><strong>{tr("Volunteer profiles", "স্বেচ্ছাসেবক প্রোফাইল")}</strong> — {tr("skills, district, and availability, to match you to nearby requests.", "দক্ষতা, জেলা ও সময় দেওয়ার তথ্য, যাতে কাছের অনুরোধে আপনাকে যুক্ত করা যায়।")}</li>
          <li><strong>{tr("Usage data", "ব্যবহারের তথ্য")}</strong> — {tr("basic, non-identifying information about how pages are used to keep the service reliable.", "সেবাটি নির্ভরযোগ্য রাখতে পেজ ব্যবহারের সাধারণ, পরিচয় প্রকাশ করে না এমন তথ্য।")}</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    heading: tr("How We Use Your Information", "আপনার তথ্য যেভাবে ব্যবহার করি"),
    body: (
      <>
        <p>{tr("Your information is used only to:", "আপনার তথ্য শুধু নিচের কাজে ব্যবহার করা হয়:")}</p>
        <ul>
          <li>{tr("Deliver flood alerts and shelter information for your area.", "আপনার এলাকার বন্যা সতর্কতা ও আশ্রয়কেন্দ্রের তথ্য পৌঁছে দিতে।")}</li>
          <li>{tr("Dispatch and track emergency rescue requests.", "জরুরি উদ্ধার অনুরোধ পাঠাতে ও ট্র্যাক করতে।")}</li>
          <li>{tr("Coordinate volunteers and relief distribution.", "স্বেচ্ছাসেবক ও ত্রাণ বিতরণ সমন্বয় করতে।")}</li>
          <li>{tr("Keep the platform accurate, secure, and available during emergencies.", "জরুরি সময়ে প্ল্যাটফর্মটি নির্ভুল, নিরাপদ ও সচল রাখতে।")}</li>
        </ul>
        <p>{tr("We never sell your personal data or use it for advertising.", "আমরা কখনো আপনার ব্যক্তিগত তথ্য বিক্রি করি না বা বিজ্ঞাপনে ব্যবহার করি না।")}</p>
      </>
    ),
  },
  {
    id: "sharing",
    heading: tr("Who Can See Your Data", "কারা আপনার তথ্য দেখতে পারেন"),
    body: (
      <p>
        {tr(
          "SOS request details are visible to verified administrators and the assigned rescue volunteer, strictly to provide help. Aggregate, non-identifying statistics (such as total shelters or resolved rescues) may be shown publicly, but these never reveal individual identities.",
          "শুধু সহায়তা দেওয়ার উদ্দেশ্যে যাচাইকৃত অ্যাডমিন ও নিযুক্ত উদ্ধার স্বেচ্ছাসেবক SOS অনুরোধের বিস্তারিত দেখতে পারেন। মোট আশ্রয়কেন্দ্র বা সম্পন্ন উদ্ধারের মতো পরিচয় প্রকাশ করে না এমন সমষ্টিগত পরিসংখ্যান সবার সামনে দেখানো হতে পারে, কিন্তু এতে কোনো ব্যক্তির পরিচয় প্রকাশ পায় না।",
        )}
      </p>
    ),
  },
  {
    id: "security",
    heading: tr("Data Security", "তথ্য নিরাপত্তা"),
    body: (
      <p>
        {tr(
          "Passwords are securely hashed, sessions use httpOnly cookies, and access to sensitive data is role-restricted. While no system is perfectly secure, we take reasonable measures to protect your information.",
          "পাসওয়ার্ড নিরাপদভাবে হ্যাশ করা হয়, সেশনে httpOnly কুকি ব্যবহৃত হয় এবং সংবেদনশীল তথ্যে প্রবেশ ভূমিকা অনুযায়ী সীমিত। কোনো ব্যবস্থাই শতভাগ নিরাপদ নয়, তবে আপনার তথ্য রক্ষায় আমরা যুক্তিসংগত নিরাপত্তা ব্যবস্থা গ্রহণ করি।",
        )}
      </p>
    ),
  },
  {
    id: "rights",
    heading: tr("Your Choices", "আপনার পছন্দ ও অধিকার"),
    body: (
      <p>
        {tr(
          "You can submit an anonymous SOS without an account. If you have an account, you may update your profile at any time or contact us to request deletion of your data, subject to any active emergency-response needs.",
          "অ্যাকাউন্ট ছাড়াই নাম প্রকাশ না করে SOS পাঠাতে পারেন। অ্যাকাউন্ট থাকলে যেকোনো সময় প্রোফাইল হালনাগাদ করতে বা চলমান জরুরি সাড়াদানের প্রয়োজন সাপেক্ষে তথ্য মুছে দেওয়ার অনুরোধ করতে আমাদের সঙ্গে যোগাযোগ করতে পারেন।",
        )}
      </p>
    ),
  },
  {
    id: "contact",
    heading: tr("Contact", "যোগাযোগ"),
    body: (
      <p>
        {tr("Questions about this policy? Reach us through the", "এই নীতি সম্পর্কে প্রশ্ন আছে? আমাদের")}{" "}
        <a href="/report">{tr("Report an Issue", "সমস্যা জানান")}</a>{" "}
        {tr("page and we'll get back to you.", "পেজের মাধ্যমে যোগাযোগ করুন; আমরা উত্তর দেব।")}
      </p>
    ),
  },
];

export default function PrivacyPage() {
  const { tr } = useT();
  return (
    <LegalLayout
      eyebrow={tr("Privacy Policy", "গোপনীয়তা নীতি")}
      icon={ShieldCheck}
      title={tr("Your Privacy Matters", "আপনার গোপনীয়তা গুরুত্বপূর্ণ")}
      description={tr(
        "How FloodAid BD collects, uses, and protects your information — written plainly, without legal jargon.",
        "FloodAid BD কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষা করে—আইনি জটিলতা ছাড়া সহজ ভাষায়।",
      )}
      lastUpdated={tr("July 2026", "জুলাই ২০২৬")}
      sections={getSections(tr)}
    />
  );
}
