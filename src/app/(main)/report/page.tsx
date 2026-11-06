"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { MessageSquareWarning, Send, Bug, ShieldAlert, AlertOctagon, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublicHero } from "@/components/public/public-hero";
import { cn } from "@/lib/utils";
import { useSubmitFeedback, type ReportCategory } from "@/lib/hooks/use-feedback";
import { useT } from "@/lib/i18n/use-t";

const CATEGORIES = [
  { id: "BUG", label: "Bug / Error", labelBn: "বাগ / ত্রুটি", icon: Bug },
  { id: "DATA_ERROR", label: "Incorrect Data", labelBn: "ভুল তথ্য", icon: AlertOctagon },
  { id: "SAFETY", label: "Safety Concern", labelBn: "নিরাপত্তা উদ্বেগ", icon: ShieldAlert },
  { id: "OTHER", label: "Something Else", labelBn: "অন্য কিছু", icon: HelpCircle },
] as const;

type ReportValues = {
  name: string;
  email?: string;
  category: "BUG" | "DATA_ERROR" | "SAFETY" | "OTHER";
  message: string;
};

export default function ReportPage() {
  const { tr } = useT();
  const submitFeedback = useSubmitFeedback();
  const [submitted, setSubmitted] = useState(false);
  const reportSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, tr("Please enter your name", "অনুগ্রহ করে আপনার নাম লিখুন")),
        email: z
          .union([z.literal(""), z.email(tr("Enter a valid email", "সঠিক ইমেইল লিখুন"))])
          .optional(),
        category: z.enum(["BUG", "DATA_ERROR", "SAFETY", "OTHER"]),
        message: z
          .string()
          .min(
            10,
            tr(
              "Please describe the issue (at least 10 characters)",
              "অনুগ্রহ করে সমস্যাটি বর্ণনা করুন (কমপক্ষে ১০ অক্ষর)",
            ),
          ),
      }),
    [tr],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { name: "", email: "", category: "BUG", message: "" },
  });

  const onSubmit = async (values: ReportValues) => {
    await submitFeedback.mutateAsync({
      name: values.name,
      email: values.email || undefined,
      category: values.category as ReportCategory,
      message: values.message,
    });
    toast.success(tr("Report sent — thank you!", "রিপোর্ট পাঠানো হয়েছে—ধন্যবাদ!"), {
      description: tr("Our team will review it shortly.", "আমাদের দল শিগগিরই এটি পর্যালোচনা করবে।"),
    });
    reset();
    setSubmitted(true);
  };

  return (
    <div className="bg-background">
      <PublicHero
        eyebrow={tr("Report an Issue", "সমস্যা জানান")}
        breadcrumb={tr("Report", "রিপোর্ট")}
        icon={MessageSquareWarning}
        title={tr("Spotted Something Wrong?", "কোনো সমস্যা চোখে পড়েছে?")}
        description={tr(
          "Report a bug, flag incorrect flood or shelter data, or suggest an improvement. Your feedback helps keep FloodAid accurate and reliable.",
          "বাগ জানান, ভুল বন্যা বা আশ্রয়কেন্দ্রের তথ্য চিহ্নিত করুন, অথবা উন্নতির পরামর্শ দিন। আপনার মতামত FloodAid-কে নির্ভুল ও নির্ভরযোগ্য রাখতে সাহায্য করে।",
        )}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center gap-4 py-8">
                  <div className="flex items-center justify-center size-16 rounded-full bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-foreground">{tr("Report received", "রিপোর্ট পাওয়া গেছে")}</h2>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      {tr(
                        "Thank you for helping us keep FloodAid accurate. Our team will review your report.",
                        "FloodAid-কে নির্ভুল রাখতে সাহায্য করার জন্য ধন্যবাদ। আমাদের দল আপনার রিপোর্ট পর্যালোচনা করবে।",
                      )}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setSubmitted(false)} className="font-semibold">
                    {tr("Send another report", "আরেকটি রিপোর্ট পাঠান")}
                  </Button>
                </div>
              ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">{tr("Your name", "আপনার নাম")}</Label>
                    <Input id="name" placeholder={tr("Rahim Uddin", "রহিম উদ্দিন")} {...register("name")} />
                    {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">{tr("Email", "ইমেইল")} <span className="font-normal text-muted-foreground">{tr("(optional)", "(ঐচ্ছিক)")}</span></Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>{tr("What kind of report is this?", "এটি কোন ধরনের রিপোর্ট?")}</Label>
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
                              {tr(c.label, c.labelBn)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message">{tr("Details", "বিস্তারিত")}</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={tr(
                      "Describe what happened, what you expected, and where (which page or district)…",
                      "কী ঘটেছে, আপনি কী আশা করেছিলেন এবং কোথায় (কোন পেজ বা জেলা)—বিস্তারিত লিখুন…",
                    )}
                    {...register("message")}
                  />
                  {errors.message && <span className="text-xs text-destructive">{errors.message.message}</span>}
                </div>

                <Button
                  type="submit"
                  size="xl"
                  disabled={submitFeedback.isPending}
                  className="font-bold gap-2 mt-1"
                >
                  <Send className="h-4 w-4" />
                  {submitFeedback.isPending ? tr("Sending…", "পাঠানো হচ্ছে…") : tr("Send Report", "রিপোর্ট পাঠান")}
                </Button>
              </form>
              )}
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
