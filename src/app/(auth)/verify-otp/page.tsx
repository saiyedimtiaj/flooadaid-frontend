"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { useInvalidateCurrentUser } from "@/lib/hooks/use-current-user";
import { verifyOtpSchema, type VerifyOtpValues } from "@/lib/validations/auth";
import type { AuthUser } from "@/lib/types/auth";

const RESEND_COOLDOWN_SECONDS = 45;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invalidateCurrentUser = useInvalidateCurrentUser();
  const email = searchParams.get("email") ?? "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, code: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(
      () => setCooldown((c) => Math.max(0, c - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (values: VerifyOtpValues) => {
    setIsSubmitting(true);
    try {
      await api.post<{ user: AuthUser }>("/auth/verify-otp", values);
      await invalidateCurrentUser();
      toast.success("Email verified!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setIsResending(true);
    try {
      await api.post("/auth/resend-otp", { email, type: "EMAIL_VERIFICATION" });
      toast.success("A new code has been sent.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Something went wrong.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-3.5">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-foreground">
            {email || "your email"}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input type="hidden" {...register("email")} value={email} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="h-11 text-center text-lg tracking-[0.5em] font-mono"
            {...register("code")}
          />
          {errors.code && (
            <span className="text-xs text-destructive">
              {errors.code.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 gap-2 font-semibold"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          Verify
        </Button>
      </form>

      <div className="flex flex-col gap-2.5 text-center text-sm text-muted-foreground">
        <p>
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </p>

        <p className="text-xs">
          Wrong email?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Sign up again
          </Link>
        </p>
      </div>
      <Link
        href="/sos"
        className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
      >
        <TriangleAlert className="h-4 w-4" />
        Skip verification — send an SOS now
      </Link>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
