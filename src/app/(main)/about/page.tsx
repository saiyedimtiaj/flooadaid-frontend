import type { Metadata } from "next";
import { AboutContent } from "./_ui/about-content";

export const metadata: Metadata = {
  title: "About — FloodAid BD",
  description:
    "FloodAid BD connects people in flood danger with shelters, rescuers and relief across Bangladesh — free for everyone.",
};

export default function AboutPage() {
  return <AboutContent />;
}
