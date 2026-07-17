"use client";

import { ScrollText } from "lucide-react";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of Terms",
    body: (
      <p>
        By accessing or using FloodAid BD, you agree to these Terms of Use. If you do not agree, please
        do not use the platform. FloodAid is provided as a free humanitarian service for communities in
        Bangladesh.
      </p>
    ),
  },
  {
    id: "purpose",
    heading: "Purpose & Proper Use",
    body: (
      <>
        <p>FloodAid exists to help people before, during, and after floods. You agree to:</p>
        <ul>
          <li>Provide accurate information when submitting an SOS or registering.</li>
          <li>Use emergency features only for genuine flood-related needs.</li>
          <li>Not submit false alerts, fake rescue requests, or misleading data.</li>
          <li>Respect the safety and privacy of others using the platform.</li>
        </ul>
      </>
    ),
  },
  {
    id: "not-a-substitute",
    heading: "Not a Substitute for Emergency Services",
    body: (
      <p>
        FloodAid <strong>complements</strong> but does not replace official emergency services. In a
        life-threatening situation, always call national emergency numbers (such as 999) in addition to
        submitting an SOS. We cannot guarantee response times or outcomes.
      </p>
    ),
  },
  {
    id: "accounts",
    heading: "Accounts & Volunteers",
    body: (
      <p>
        You are responsible for keeping your account credentials secure. Volunteers must complete
        verification before being assigned to rescue requests and agree to act responsibly and lawfully
        when responding.
      </p>
    ),
  },
  {
    id: "availability",
    heading: "Availability & Accuracy",
    body: (
      <p>
        We work to keep flood, shelter, and alert data accurate and the service available, especially
        during emergencies. However, data may be delayed or incomplete, and the platform is provided
        &ldquo;as is&rdquo; without warranties of uninterrupted availability.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of Liability",
    body: (
      <p>
        To the fullest extent permitted by law, FloodAid BD and its contributors are not liable for
        losses arising from reliance on the platform. Always follow instructions from local authorities
        and the Flood Forecasting &amp; Warning Centre (FFWC).
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to These Terms",
    body: (
      <p>
        We may update these Terms as the platform evolves. Continued use after changes means you accept
        the updated Terms. The &ldquo;last updated&rdquo; date above reflects the current version.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Terms of Use"
      icon={ScrollText}
      title="Terms of Use"
      description="The ground rules for using FloodAid BD responsibly — so the platform stays reliable for everyone in an emergency."
      lastUpdated="July 2026"
      sections={SECTIONS}
    />
  );
}
