"use client";

import { ShieldCheck } from "lucide-react";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "Overview",
    body: (
      <p>
        FloodAid BD is a humanitarian flood-response platform. We collect the minimum information
        needed to deliver alerts, connect people to shelters, and coordinate rescue — nothing more.
        This policy explains what we collect, why, and the choices you have.
      </p>
    ),
  },
  {
    id: "collect",
    heading: "Information We Collect",
    body: (
      <>
        <p>Depending on how you use FloodAid, we may collect:</p>
        <ul>
          <li><strong>Account details</strong> — your name, email, phone, and role, if you register.</li>
          <li><strong>SOS requests</strong> — your name, phone, GPS location, and situation details, so rescuers can reach you.</li>
          <li><strong>Volunteer profiles</strong> — skills, district, and availability, to match you to nearby requests.</li>
          <li><strong>Usage data</strong> — basic, non-identifying information about how pages are used to keep the service reliable.</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    heading: "How We Use Your Information",
    body: (
      <>
        <p>Your information is used only to:</p>
        <ul>
          <li>Deliver flood alerts and shelter information for your area.</li>
          <li>Dispatch and track emergency rescue requests.</li>
          <li>Coordinate volunteers and relief distribution.</li>
          <li>Keep the platform accurate, secure, and available during emergencies.</li>
        </ul>
        <p>We never sell your personal data or use it for advertising.</p>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "Who Can See Your Data",
    body: (
      <p>
        SOS request details are visible to verified administrators and the assigned rescue volunteer,
        strictly to provide help. Aggregate, non-identifying statistics (such as total shelters or
        resolved rescues) may be shown publicly, but these never reveal individual identities.
      </p>
    ),
  },
  {
    id: "security",
    heading: "Data Security",
    body: (
      <p>
        Passwords are securely hashed, sessions use httpOnly cookies, and access to sensitive data is
        role-restricted. While no system is perfectly secure, we take reasonable measures to protect
        your information.
      </p>
    ),
  },
  {
    id: "rights",
    heading: "Your Choices",
    body: (
      <p>
        You can submit an anonymous SOS without an account. If you have an account, you may update your
        profile at any time or contact us to request deletion of your data, subject to any active
        emergency-response needs.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about this policy? Reach us through the <a href="/report">Report an Issue</a> page and
        we&apos;ll get back to you.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy Policy"
      icon={ShieldCheck}
      title="Your Privacy Matters"
      description="How FloodAid BD collects, uses, and protects your information — written plainly, without legal jargon."
      lastUpdated="July 2026"
      sections={SECTIONS}
    />
  );
}
