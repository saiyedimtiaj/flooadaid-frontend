"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, LogIn, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { useInvalidateCurrentUser } from "@/lib/hooks/use-current-user";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import type { AuthUser } from "@/lib/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const invalidateCurrentUser = useInvalidateCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true);
    try {
      await api.post<{ user: AuthUser }>("/auth/login", values);
      await invalidateCurrentUser();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        toast.error(error.message);
        router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
      } else if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Sign in to access your FloodAid dashboard
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-xs text-destructive">
              {errors.password.message}
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
            <LogIn className="h-4 w-4" />
          )}
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>

      {/* emergency escape hatch — nobody mid-flood should be stuck at a login wall */}
      <Link
        href="/sos"
        className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
      >
        <TriangleAlert className="h-4 w-4" />
        Skip login — send an SOS now
      </Link>
    </div>
  );
}
