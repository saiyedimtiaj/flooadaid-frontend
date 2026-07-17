"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { signupSchema, type SignupValues } from "@/lib/validations/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/signup", {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });
      toast.success(
        "Account created! Check your email for a verification code.",
      );
      router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
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
        <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Join FloodAid to request help and coordinate relief
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            className="h-11"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-xs text-destructive">
              {errors.name.message}
            </span>
          )}
        </div>

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
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            className="h-11"
            {...register("phone")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
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
            <UserPlus className="h-4 w-4" />
          )}
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
        Skip signup — send an SOS now
      </Link>
    </div>
  );
}
