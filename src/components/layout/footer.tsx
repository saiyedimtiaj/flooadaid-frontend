import Link from "next/link";
import { Waves, ChevronRight, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

const platformLinks: FooterLink[] = [
  { href: "/alerts", label: "Flood Alerts" },
  { href: "/shelters", label: "Shelter Finder" },
  { href: "/sos", label: "Emergency SOS" },
  { href: "/tracker", label: "Relief Tracker" },
  { href: "/get-involved", label: "Volunteer Hub" },
];

const resourceLinks: FooterLink[] = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/safety", label: "Safety Guidelines" },
  { href: "/report", label: "Report an Issue" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground text-background/85 pt-12 md:pt-16 pb-8 border-t border-transparent">
      <div
        className="absolute top-0 inset-x-0 h-40 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--destructive)_8%,transparent),transparent)] hidden md:block"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(color-mix(in_oklch,var(--background)_2%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]"
        aria-hidden="true"
      />

      <div
        className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-destructive/25 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto container px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 items-start text-center md:text-left">
          <div className="flex flex-col items-center md:items-start md:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-destructive"
              aria-label="FloodAid BD Home"
            >
              <div className="flex items-center justify-center size-9 rounded-xl bg-destructive/15 text-destructive shadow-xs">
                <Waves className="size-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-destructive">Flood</span>
                <span className="text-background">Aid</span>
              </span>
            </Link>

            <p className="mt-4 text-sm text-background/65 leading-relaxed max-w-sm md:max-w-xs">
              Protecting lives through real-time flood information, shelter
              access, and emergency coordination across Bangladesh.
            </p>

            <div className="mt-6 flex items-center gap-4 text-background/55">
              <span className="text-xs text-background/50 font-medium ml-1 select-none">
                Made with ❤️ for Bangladesh
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-background/55 mb-4">
              Platform
            </h3>
            <ul className="w-full space-y-2.5">
              {platformLinks.map((link) => (
                <li
                  key={link.href}
                  className="flex justify-center md:justify-start"
                >
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-background/65 hover:text-background transition-all duration-200 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-destructive rounded-sm"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="size-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-destructive" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-background/55 mb-4">
              Resources
            </h3>
            <ul className="w-full space-y-2.5">
              {resourceLinks.map((link) => (
                <li
                  key={link.href}
                  className="flex justify-center md:justify-start"
                >
                  {link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 text-sm text-background/65 hover:text-background transition-all duration-200 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-destructive rounded-sm"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="size-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-background/65 hover:text-background transition-all duration-200 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-destructive rounded-sm"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="size-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-destructive" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start w-full">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-warning mb-4">
              Emergency
            </h3>

            <div className="space-y-2 mb-5 w-full">
              <div className="flex items-center justify-center md:justify-start gap-2.5 text-background">
                <Phone className="size-4 text-destructive shrink-0" />
                <span className="text-sm font-medium">National Help:</span>
                <span className="text-base font-bold text-destructive">
                  999
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 text-background">
                <Phone className="size-4 text-destructive shrink-0" />
                <span className="text-sm font-medium">FFWC Hotline:</span>
                <span className="text-base font-bold text-destructive">
                  10941
                </span>
              </div>
            </div>

            <Button
              variant="destructive-outline"
              size="sm"
              className="w-full justify-center rounded-xl"
            >
              <Link href="/sos">Get Help Now</Link>
            </Button>

            <p className="mt-3 text-[11px] text-background/50 font-medium">
              Available 24/7 across Bangladesh
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-6 relative">
          <div
            className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-background/10 to-transparent"
            aria-hidden="true"
          />
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center text-xs text-background/50 font-medium">
            <div>&copy; 2026 FloodAid BD</div>
            <div>
              CSE 322 &middot; Software Engineering Project &middot; Port
              City International University
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/privacy"
                className="hover:text-background transition-colors focus-visible:outline-2 focus-visible:outline-destructive rounded-xs"
              >
                Privacy Policy
              </Link>
              <span className="text-background/30 select-none font-bold">
                &middot;
              </span>
              <Link
                href="/terms"
                className="hover:text-background transition-colors focus-visible:outline-2 focus-visible:outline-destructive rounded-xs"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
