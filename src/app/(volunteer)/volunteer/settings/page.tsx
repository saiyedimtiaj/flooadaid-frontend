"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, Loader2, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validations/auth";
import { ROLE_LABEL } from "@/components/dashboard/nav-config";

export default function VolunteerSettingsPage() {
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

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary shrink-0">
            <UserCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Account</h2>
            <p className="text-xs text-muted-foreground">Your profile information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Name
            </span>
            <span className="font-semibold text-foreground">{user?.name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Email
            </span>
            <span className="font-semibold text-foreground">{user?.email}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Role
            </span>
            <span className="font-semibold text-foreground">
              {user ? ROLE_LABEL[user.role] : "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Phone
            </span>
            <span className="font-semibold text-foreground">{user?.phone || "—"}</span>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary shrink-0">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Change Password</h2>
            <p className="text-xs text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <span className="text-xs text-destructive">
                {errors.currentPassword.message}
              </span>
            )}
          </div>

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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 gap-2 font-semibold self-start"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
