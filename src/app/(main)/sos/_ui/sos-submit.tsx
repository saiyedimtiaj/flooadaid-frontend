"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  XCircle,
  Loader2,
  Lock,
  CheckCircle,
  Radio,
  Phone,
  Users,
  LifeBuoy,
  MapPin,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SOSSubmitProps {
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: () => void;
  sosId: string | null;
  missingRequirements?: string[];
  peopleCount?: string | null;
  helpTypes?: string[];
  address?: string;
}

const NEXT_STEPS = [
  {
    title: "Request reviewed",
    description: "Your request is being reviewed by our response team",
  },
  {
    title: "Team assigned",
    description: "A volunteer or rescue team will be assigned to your location",
  },
  {
    title: "Stay updated",
    description: "You'll see live status updates below — keep this page open",
  },
];

export default function SOSSubmit({
  isValid,
  isSubmitting,
  isSubmitted,
  onSubmit,
  sosId,
  missingRequirements = [],
  peopleCount,
  helpTypes = [],
  address,
}: SOSSubmitProps) {
  if (isSubmitted) {
    return (
      <motion.div
        key="sos-confirmation"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="w-full py-6"
      >
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/8 via-transparent to-primary/5 px-6 py-12 md:px-10 md:py-16 text-center">
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{ duration: 0.5, times: [0, 0.7, 1] }}
            className="relative rounded-full bg-emerald-500/10 size-20 mx-auto flex items-center justify-center"
          >
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-emerald-500/40"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle className="size-10 text-emerald-500" />
            </motion.div>
          </motion.div>

          <h2 className="relative text-2xl md:text-4xl font-extrabold text-foreground mt-6">
            SOS Sent Successfully
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative inline-flex mt-3 bg-background/80 backdrop-blur-xs border border-border rounded-full px-4 py-1.5 mx-auto"
          >
            <span className="text-sm font-mono font-semibold text-foreground">
              Reference: #{sosId ? sosId.slice(-6).toUpperCase() : "—"}
            </span>
          </motion.div>

          <p className="relative text-sm md:text-base text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
            Your emergency request has been received. Our team is reviewing it
            and will dispatch help as soon as possible.
          </p>

          {sosId && (
            <div className="relative mt-4 mx-auto max-w-sm">
              <p className="text-xs text-muted-foreground mb-1.5">
                Save this ID to check status later from any device:
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(sosId);
                  toast.success("Copied tracking ID");
                }}
                className="w-full inline-flex items-center justify-between gap-2 bg-background/90 border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground hover:border-primary/40 transition-colors"
              >
                <span className="truncate">{sosId}</span>
                <Copy className="size-3.5 shrink-0 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Card className="rounded-3xl p-6 border border-border bg-card h-full">
              <h3 className="text-sm font-bold text-foreground mb-5">
                Request Summary
              </h3>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Users className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      People
                    </span>
                    <span className="text-base font-semibold text-foreground">
                      {peopleCount ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0">
                    <LifeBuoy className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Help Needed
                    </span>
                    <span className="text-base font-semibold text-foreground truncate block">
                      {helpTypes.length > 0 ? helpTypes.join(", ") : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Location
                    </span>
                    <span className="text-base font-semibold text-foreground truncate block" title={address}>
                      {address || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="rounded-3xl p-6 border border-border bg-card h-full">
              <h3 className="text-sm font-bold text-foreground mb-5">
                What happens next
              </h3>
              <div className="relative flex flex-col gap-5">
                <div
                  className="absolute left-3 top-2 bottom-2 w-px bg-border"
                  aria-hidden="true"
                />
                {NEXT_STEPS.map((step, idx) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.15 }}
                    className="relative flex items-start gap-3"
                  >
                    <div className="relative z-10 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-none">
                        {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6 flex flex-col sm:flex-row justify-center gap-3"
        >
          <Button
            onClick={() => {
              const element = document.getElementById("tracking-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="gap-2 rounded-xl font-semibold"
          >
            <Radio className="size-4" />
            Track My Request
          </Button>

          <Button variant="outline" className="gap-2 rounded-xl font-semibold">
            <a
              href="tel:999"
              className="flex items-center justify-center gap-2"
            >
              <Phone className="size-4" />
              Call 999
            </a>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence>
        {!isValid && missingRequirements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-1 mt-4 mb-3 overflow-hidden"
          >
            {missingRequirements.map((req) => (
              <motion.div
                key={req}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <XCircle className="size-3.5 text-destructive shrink-0" />
                <span className="text-xs text-destructive font-medium">
                  {req}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <motion.button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          whileTap={isValid && !isSubmitting ? { scale: 0.97 } : undefined}
          animate={
            isValid && !isSubmitting
              ? {
                  boxShadow: [
                    "0 0 0 0px rgba(239, 68, 68, 0)",
                    "0 0 0 6px rgba(239, 68, 68, 0.2)",
                    "0 0 0 0px rgba(239, 68, 68, 0)",
                  ],
                }
              : { boxShadow: "0 0 0 0px rgba(0, 0, 0, 0)" }
          }
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut",
          }}
          className={`w-full h-14 rounded-xl text-lg font-bold flex items-center justify-center gap-2 select-none transition-colors duration-150 ${
            isValid && !isSubmitting
              ? "bg-destructive text-white cursor-pointer"
              : "bg-destructive/40 text-white/60 cursor-not-allowed"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isSubmitting ? (
              <motion.span
                key="submitting"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="size-5 animate-spin" />
                Sending SOS...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                🆘 Send Emergency SOS
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3 select-none">
        <Lock className="size-3 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground font-medium">
          Your information is secure and shared only with rescue teams
        </span>
      </div>
    </div>
  );
}
