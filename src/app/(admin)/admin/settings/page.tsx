"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import {
  KeyRound,
  Loader2,
  Settings as SettingsIcon,
  Mail,
  Phone,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { api, ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validations/auth";
import { ROLE_LABEL } from "@/components/dashboard/nav-config";

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

function initialsOf(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminSettingsPage() {
  const { data: user } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (values: ChangePasswordValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully.");
      reset();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoRows = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: BadgeCheck, label: "Role", value: user ? ROLE_LABEL[user.role] : "—" },
    { icon: Phone, label: "Phone", value: user?.phone || "Not set" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Manage your profile and account security"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      {/* Profile hero card */}
      <motion.div variants={fade} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden rounded-3xl border border-border bg-card">
          <div className="h-24 bg-linear-to-r from-primary/25 via-primary/10 to-accent-teal/15" />
          <div className="px-6 pb-6 -mt-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-card shadow-md">
                <AvatarFallback className="bg-primary/15 text-primary text-2xl font-black">
                  {initialsOf(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-foreground truncate">
                    {user?.name ?? "—"}
                  </h2>
                  {user && (
                    <Badge variant="primary" dot>
                      {ROLE_LABEL[user.role]}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {infoRows.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-3.5"
                >
                  <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-foreground truncate block">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Change password */}
      <motion.div variants={fade} initial="hidden" animate="visible" transition={{ delay: 0.08 }}>
        <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Change Password</h2>
              <p className="text-xs text-muted-foreground">
                Use a strong password to keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" type="password" {...register("currentPassword")} />
              {errors.currentPassword && (
                <span className="text-xs text-destructive">
                  {errors.currentPassword.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                {errors.newPassword && (
                  <span className="text-xs text-destructive">{errors.newPassword.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <span className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-muted/30 border border-border/60 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              Your password is encrypted and never shared.
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 gap-2 font-semibold self-start"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}
