"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, Loader2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/forgot-password", values);
      toast.success("If that account exists, a reset code has been sent.");
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-3.5">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">
          Forgot password?
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Enter your email and we&apos;ll send you a reset code
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-11"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-xs text-destructive">
              {errors.email.message}
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
            <KeyRound className="h-4 w-4" />
          )}
          Send Reset Code
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>

      <Link
        href="/sos"
        className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
      >
        <TriangleAlert className="h-4 w-4" />
        Skip layout — send an SOS now
      </Link>
    </div>
  );
}
