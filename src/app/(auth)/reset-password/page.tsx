"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, Loader2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, code: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", {
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
      });
      toast.success("Password reset successfully. You can now log in.");
      router.push("/login");
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
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Enter the code sent to{" "}
          <span className="font-semibold text-foreground">
            {email || "your email"}
          </span>{" "}
          and choose a new password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="h-11"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-xs text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code">Reset code</Label>
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            className="h-11"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className="text-xs text-destructive">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-11"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-destructive">
              {errors.confirmPassword.message}
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
          Reset Password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Back to sign in
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
