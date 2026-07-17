"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  UserCheck,
  Truck,
  CheckCircle,
  Check,
  Phone,
  ShieldAlert,
  Star,
  Ban,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { SosRequest, SosStatus } from "@/lib/types/api"

interface SOSTrackerProps {
  isVisible: boolean
  sos: SosRequest | null | undefined
  isLoading: boolean
}

const STEPS: { id: SosStatus; label: string; desc: string; icon: typeof Clock }[] = [
  { id: "PENDING", label: "Pending", desc: "Request received, waiting for review", icon: Clock },
  { id: "ASSIGNED", label: "Assigned", desc: "A volunteer/team has been assigned", icon: UserCheck },
  { id: "IN_PROGRESS", label: "En Route", desc: "Rescue team is on the way", icon: Truck },
  { id: "RESOLVED", label: "Resolved", desc: "Rescued successfully", icon: CheckCircle },
]

export default function SOSTracker({ isVisible, sos, isLoading }: SOSTrackerProps) {
  if (!isVisible) return null

  if (isLoading || !sos) {
    return (
      <motion.div
        id="tracking-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-2 mb-12 scroll-mt-6"
      >
        <Card className="rounded-3xl p-6 md:p-7 border border-border bg-card animate-pulse h-40" />
      </motion.div>
    )
  }

  if (sos.status === "CANCELLED") {
    return (
      <motion.div
        id="tracking-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-2 mb-12 scroll-mt-6"
      >
        <Card className="rounded-3xl p-6 md:p-7 border border-border bg-card flex items-center gap-3">
          <Ban className="size-5 text-muted-foreground shrink-0" />
          <div>
            <h3 className="text-base font-bold text-foreground">Request Cancelled</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              This SOS request (#{sos.id.slice(-6).toUpperCase()}) was cancelled.
            </p>
          </div>
        </Card>
      </motion.div>
    )
  }

  const currentStepIndex = STEPS.findIndex((step) => step.id === sos.status)

  return (
    <AnimatePresence>
      <motion.div
        id="tracking-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full mt-2 mb-12 scroll-mt-6"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="rounded-full bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] size-7 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-foreground">3</span>
          </div>
          <span className="text-base font-bold text-foreground">
            Track Your Request
          </span>
        </div>

        <Card className="rounded-3xl p-6 md:p-7 border border-border bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Request Status</h3>
            <span className="bg-muted rounded-full px-3 py-1 text-xs font-mono text-muted-foreground select-none">
              #{sos.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="hidden md:flex items-center mt-8 w-full">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex
              const isActive = idx === currentStepIndex
              const isUpcoming = idx > currentStepIndex
              const StepIcon = step.icon

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: idx * 0.1 }}
                      className="relative"
                    >
                      {isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.1, 0.2] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="absolute -inset-1 rounded-full bg-primary/20 ring-4 ring-primary/20 z-0"
                        />
                      )}
                      <div
                        className={`size-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${
                          isCompleted
                            ? "bg-emerald-500 text-emerald-50"
                            : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="size-4 shrink-0" />
                        ) : (
                          <StepIcon className={`size-4 shrink-0 ${isUpcoming ? "opacity-40" : ""}`} />
                        )}
                      </div>
                    </motion.div>
                    <span
                      className={`text-xs mt-2 text-center absolute -bottom-6 w-20 truncate ${
                        isCompleted
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-muted relative overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: isCompleted ? "100%" : isActive ? "50%" : "0%"
                        }}
                        transition={{ duration: 0.4 }}
                        className={`absolute top-0 left-0 h-full ${
                          isCompleted ? "bg-emerald-500" : "bg-primary"
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="hidden md:block h-8" />

          <div className="flex flex-col gap-5 mt-5 md:hidden">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex
              const isActive = idx === currentStepIndex
              const isUpcoming = idx > currentStepIndex
              const StepIcon = step.icon

              return (
                <div key={step.id} className="flex gap-3 relative">
                  {idx < STEPS.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-muted">
                      <motion.div
                        initial={{ height: "0%" }}
                        animate={{
                          height: isCompleted ? "100%" : isActive ? "50%" : "0%"
                        }}
                        transition={{ duration: 0.4 }}
                        className={`w-full ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                      />
                    </div>
                  )}

                  <div className="relative shrink-0">
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -inset-1 rounded-full bg-primary/20 ring-4 ring-primary/20 z-0"
                      />
                    )}
                    <div
                      className={`size-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 text-emerald-50"
                          : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="size-4 shrink-0" />
                      ) : (
                        <StepIcon className={`size-4 shrink-0 ${isUpcoming ? "opacity-40" : ""}`} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center py-1">
                    <span
                      className={`text-sm font-semibold leading-tight ${
                        isCompleted
                          ? "text-emerald-600 dark:text-emerald-400"
                          : isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <AnimatePresence mode="wait">
              {sos.status === "PENDING" && (
                <motion.div
                  key="pending-details"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground shrink-0 animate-pulse" />
                    <span className="text-sm text-muted-foreground font-medium">
                      Your request is being reviewed. This page updates automatically.
                    </span>
                  </div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden relative">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute top-0 left-0 w-1/3 h-full bg-linear-to-r from-transparent via-primary/50 to-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {sos.status === "ASSIGNED" && (
                <motion.div
                  key="assigned-details"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="size-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground font-semibold">
                      A rescue volunteer has been assigned to your request.
                    </span>
                  </div>

                  {sos.assignedTo && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted/30 border border-border/50 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {sos.assignedTo.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-foreground leading-none">
                            {sos.assignedTo.name}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            Assigned volunteer
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 self-start sm:self-auto rounded-md"
                      >
                        <a href={`tel:${sos.assignedTo.phone}`} className="flex items-center gap-1.5">
                          <Phone className="size-3.5" />
                          Call Volunteer
                        </a>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {sos.status === "IN_PROGRESS" && (
                <motion.div
                  key="inprogress-details"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-sky-500 shrink-0" />
                    <span className="text-sm text-foreground font-semibold">
                      Rescue team is heading to your location. Stay where you are.
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2 items-start bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg">
                    <ShieldAlert className="size-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-normal">
                      Stay on higher ground. Keep your phone charged.
                    </p>
                  </div>
                </motion.div>
              )}

              {sos.status === "RESOLVED" && (
                <motion.div
                  key="resolved-details"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-foreground font-medium">
                      You have been marked as rescued. We&apos;re glad you&apos;re safe.
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" className="h-8 text-xs gap-1 rounded-md">
                      <Star className="size-3" />
                      Rate Response
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
