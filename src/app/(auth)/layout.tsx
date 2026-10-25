import Link from "next/link";
import Image from "next/image";
import { Waves, Radio } from "lucide-react";
import { AuthSituationPanel } from "./_ui/auth-situation-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between overflow-hidden">
        <Image
          src="/images/auth-banner.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/20" />
        <div
          className="absolute inset-0 mix-blend-multiply opacity-70"
          style={{ background: "var(--gradient-dusk)" }}
        />
        <div
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--accent-teal)" }}
        />
        <div
          className="absolute -bottom-32 -right-16 h-112 w-md rounded-full blur-3xl opacity-20"
          style={{ background: "var(--accent-gold)" }}
        />

        <div className="relative z-10 flex items-center justify-between p-8 xl:p-12">
          <Link href="/" className="inline-flex items-center gap-2 select-none">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 backdrop-blur-sm text-white shrink-0 ring-1 ring-white/20">
              <Waves className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Flood<span className="text-white/70">Aid</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/15 pl-2.5 pr-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-alert-normal animate-pulse-soft" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-alert-normal" />
            </span>
            <Radio className="h-3 w-3 text-white/60" />
            <span className="text-[11px] font-semibold text-white/80 tracking-wide">
              Live district watch
            </span>
          </div>
        </div>

        <div className="relative z-10 p-8 xl:p-12 flex flex-col gap-9 max-w-lg">
          <div className="animate-slide-up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55 mb-4">
              Bangladesh · Flood Response
            </p>
            <h1 className="text-4xl xl:text-[2.75rem] font-extrabold text-white leading-[1.12] tracking-tight">
              Every minute counts
              <br />
              when the water{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--accent-teal), #ffffff)",
                }}
              >
                rises
              </span>
              .
            </h1>
            <p className="mt-5 text-[15px] text-white/70 leading-relaxed">
              Real-time alerts, shelter locations, and rescue coordination —
              built for the districts that need it most.
            </p>
          </div>

          <AuthSituationPanel />
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_5%,transparent),transparent)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-sm">
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2 mb-8 select-none"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-destructive/10 text-destructive shrink-0">
              <Waves className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-destructive">Flood</span>
              <span className="text-foreground">Aid</span>
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
