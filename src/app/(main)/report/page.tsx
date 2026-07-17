"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MessageSquareWarning, Send, Bug, Lightbulb, AlertOctagon, HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublicHero } from "@/components/public/public-hero";
import { cn } from "@/lib/utils";

const REPORT_EMAIL = "support@floodaid.bd";

const CATEGORIES = [
  { id: "bug", label: "Bug / Error", icon: Bug },
  { id: "data", label: "Incorrect Data", icon: AlertOctagon },
  { id: "idea", label: "Feature Idea", icon: Lightbulb },
  { id: "other", label: "Something Else", icon: HelpCircle },
] as const;

const reportSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  category: z.enum(["bug", "data", "idea", "other"]),
  message: z.string().min(10, "Please describe the issue (at least 10 characters)"),
});

type ReportValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { name: "", email: "", category: "bug", message: "" },
  });

  const onSubmit = (values: ReportValues) => {
    const categoryLabel = CATEGORIES.find((c) => c.id === values.category)?.label ?? values.category;
    const subject = `[FloodAid Report] ${categoryLabel} — from ${values.name}`;
    const body = `Name: ${values.name}\nEmail: ${values.email}\nCategory: ${categoryLabel}\n\n${values.message}`;
    window.location.href = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your email app to send the report…");
    reset();
  };

  return (
    <div className="bg-background">
      <PublicHero
        eyebrow="Report an Issue"
        breadcrumb="Report"
        icon={MessageSquareWarning}
        title="Spotted Something Wrong?"
        description="Report a bug, flag incorrect flood or shelter data, or suggest an improvement. Your feedback helps keep FloodAid accurate and reliable."
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" placeholder="Rahim Uddin" {...register("name")} />
                    {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>What kind of report is this?</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2.5">
                        {CATEGORIES.map((c) => {
                          const Icon = c.icon;
                          const active = field.value === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => field.onChange(c.id)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm font-semibold transition-colors",
                                active
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border bg-background text-muted-foreground hover:bg-muted",
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message">Details</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Describe what happened, what you expected, and where (which page or district)…"
                    {...register("message")}
                  />
                  {errors.message && <span className="text-xs text-destructive">{errors.message.message}</span>}
                </div>

                <Button type="submit" size="xl" className="font-bold gap-2 mt-1">
                  <Send className="h-4 w-4" />
                  Send Report
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  This opens your email app addressed to {REPORT_EMAIL}
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
