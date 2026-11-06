"use client";

import { ScrollText } from "lucide-react";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";
import { useT } from "@/lib/i18n/use-t";

type Translate = (english: string, bangla: string) => string;

const getSections = (tr: Translate): LegalSection[] => [
  {
    id: "acceptance",
    heading: tr("Acceptance of Terms", "শর্তাবলি গ্রহণ"),
    body: (
      <p>
        {tr(
          "By accessing or using FloodAid BD, you agree to these Terms of Use. If you do not agree, please do not use the platform. FloodAid is provided as a free humanitarian service for communities in Bangladesh.",
          "FloodAid BD-তে প্রবেশ বা এটি ব্যবহার করে আপনি এই ব্যবহারের শর্তাবলিতে সম্মত হচ্ছেন। সম্মত না হলে প্ল্যাটফর্মটি ব্যবহার করবেন না। FloodAid বাংলাদেশের কমিউনিটিগুলোর জন্য বিনামূল্যের মানবিক সেবা হিসেবে দেওয়া হয়।",
        )}
      </p>
    ),
  },
  {
    id: "purpose",
    heading: tr("Purpose & Proper Use", "উদ্দেশ্য ও সঠিক ব্যবহার"),
    body: (
      <>
        <p>{tr("FloodAid exists to help people before, during, and after floods. You agree to:", "বন্যার আগে, সময়ে ও পরে মানুষকে সহায়তা করাই FloodAid-এর উদ্দেশ্য। আপনি সম্মত হচ্ছেন:")}</p>
        <ul>
          <li>{tr("Provide accurate information when submitting an SOS or registering.", "SOS পাঠানো বা নিবন্ধনের সময় সঠিক তথ্য দিতে।")}</li>
          <li>{tr("Use emergency features only for genuine flood-related needs.", "জরুরি সুবিধা শুধু প্রকৃত বন্যাসংক্রান্ত প্রয়োজনে ব্যবহার করতে।")}</li>
          <li>{tr("Not submit false alerts, fake rescue requests, or misleading data.", "মিথ্যা সতর্কতা, ভুয়া উদ্ধার অনুরোধ বা বিভ্রান্তিকর তথ্য না দিতে।")}</li>
          <li>{tr("Respect the safety and privacy of others using the platform.", "প্ল্যাটফর্ম ব্যবহারকারী অন্যদের নিরাপত্তা ও গোপনীয়তার প্রতি সম্মান দেখাতে।")}</li>
        </ul>
      </>
    ),
  },
  {
    id: "not-a-substitute",
    heading: tr("Not a Substitute for Emergency Services", "সরকারি জরুরি সেবার বিকল্প নয়"),
    body: (
      <p>
        {tr("FloodAid", "FloodAid")} <strong>{tr("complements", "সহায়ক")}</strong>{" "}
        {tr(
          "but does not replace official emergency services. In a life-threatening situation, always call national emergency numbers (such as 999) in addition to submitting an SOS. We cannot guarantee response times or outcomes.",
          "তবে সরকারি জরুরি সেবার বিকল্প নয়। জীবনসংকটাপন্ন পরিস্থিতিতে SOS পাঠানোর পাশাপাশি সবসময় জাতীয় জরুরি নম্বরে (যেমন ৯৯৯) কল করুন। সাড়াদানের সময় বা ফলাফল আমরা নিশ্চিত করতে পারি না।",
        )}
      </p>
    ),
  },
  {
    id: "accounts",
    heading: tr("Accounts & Volunteers", "অ্যাকাউন্ট ও স্বেচ্ছাসেবক"),
    body: (
      <p>
        {tr(
          "You are responsible for keeping your account credentials secure. Volunteers must complete verification before being assigned to rescue requests and agree to act responsibly and lawfully when responding.",
          "আপনার অ্যাকাউন্টের পরিচয়তথ্য নিরাপদ রাখার দায়িত্ব আপনার। উদ্ধার অনুরোধে নিযুক্ত হওয়ার আগে স্বেচ্ছাসেবকদের যাচাই সম্পন্ন করতে হবে এবং সাড়াদানের সময় দায়িত্বশীল ও আইনসম্মত আচরণে সম্মত হতে হবে।",
        )}
      </p>
    ),
  },
  {
    id: "availability",
    heading: tr("Availability & Accuracy", "সেবা সচলতা ও তথ্যের নির্ভুলতা"),
    body: (
      <p>
        {tr(
          "We work to keep flood, shelter, and alert data accurate and the service available, especially during emergencies. However, data may be delayed or incomplete, and the platform is provided “as is” without warranties of uninterrupted availability.",
          "বিশেষ করে জরুরি সময়ে বন্যা, আশ্রয়কেন্দ্র ও সতর্কতার তথ্য নির্ভুল এবং সেবা সচল রাখতে আমরা কাজ করি। তবে তথ্য দেরিতে আসতে বা অসম্পূর্ণ হতে পারে এবং নিরবচ্ছিন্ন সেবার নিশ্চয়তা ছাড়াই প্ল্যাটফর্মটি বর্তমান অবস্থায় প্রদান করা হয়।",
        )}
      </p>
    ),
  },
  {
    id: "liability",
    heading: tr("Limitation of Liability", "দায়বদ্ধতার সীমা"),
    body: (
      <p>
        {tr(
          "To the fullest extent permitted by law, FloodAid BD and its contributors are not liable for losses arising from reliance on the platform. Always follow instructions from local authorities and the Flood Forecasting & Warning Centre (FFWC).",
          "আইনে অনুমোদিত সর্বোচ্চ সীমা পর্যন্ত, প্ল্যাটফর্মের ওপর নির্ভরতার ফলে হওয়া ক্ষতির জন্য FloodAid BD ও এর অবদানকারীরা দায়ী নন। সবসময় স্থানীয় কর্তৃপক্ষ এবং বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্রের (FFWC) নির্দেশনা অনুসরণ করুন।",
        )}
      </p>
    ),
  },
  {
    id: "changes",
    heading: tr("Changes to These Terms", "শর্তাবলির পরিবর্তন"),
    body: (
      <p>
        {tr(
          "We may update these Terms as the platform evolves. Continued use after changes means you accept the updated Terms. The “last updated” date above reflects the current version.",
          "প্ল্যাটফর্মের পরিবর্তনের সঙ্গে আমরা এই শর্তাবলি হালনাগাদ করতে পারি। পরিবর্তনের পর ব্যবহার চালিয়ে গেলে আপনি হালনাগাদ শর্ত মেনে নিয়েছেন বলে ধরা হবে। উপরের ‘সর্বশেষ হালনাগাদ’ তারিখটি বর্তমান সংস্করণ নির্দেশ করে।",
        )}
      </p>
    ),
  },
];

export default function TermsPage() {
  const { tr } = useT();
  return (
    <LegalLayout
      eyebrow={tr("Terms of Use", "ব্যবহারের শর্তাবলি")}
      icon={ScrollText}
      title={tr("Terms of Use", "ব্যবহারের শর্তাবলি")}
      description={tr(
        "The ground rules for using FloodAid BD responsibly — so the platform stays reliable for everyone in an emergency.",
        "FloodAid BD দায়িত্বশীলভাবে ব্যবহারের মূল নিয়ম—যাতে জরুরি সময়ে প্ল্যাটফর্মটি সবার জন্য নির্ভরযোগ্য থাকে।",
      )}
      lastUpdated={tr("July 2026", "জুলাই ২০২৬")}
      sections={getSections(tr)}
    />
  );
}
