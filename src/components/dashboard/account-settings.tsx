"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, Loader2, Settings as SettingsIcon, ShieldCheck, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { DistrictSelect } from "@/components/dashboard/district-select";
import { api, ApiError } from "@/lib/api-client";
import { useCurrentUser, useUpdateProfile, type ProfileInput } from "@/lib/hooks/use-current-user";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validations/auth";
import type { AuthUser } from "@/lib/types/auth";
import { ROLE_LABEL } from "./nav-config";

function ProfileForm({ user }: { user: AuthUser }) {
  const updateProfile = useUpdateProfile();
  const { register, handleSubmit, control, formState } = useForm<ProfileInput>({
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      districtId: user.districtId ?? undefined,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        updateProfile.mutate({
          name: values.name?.trim(),
          phone: values.phone?.trim() || undefined,
          districtId: values.districtId,
        }),
      )}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name", { required: true, minLength: 2 })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="01XXXXXXXXX" {...register("phone")} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Home district</Label>
        <Controller
          name="districtId"
          control={control}
          render={({ field }) => <DistrictSelect value={field.value} onChange={field.onChange} />}
        />
        <p className="text-xs text-muted-foreground">
          You get a notification when a Warning, Danger or Critical flood alert is issued for this district.
        </p>
      </div>
      <Button
        type="submit"
        disabled={!formState.isDirty || updateProfile.isPending}
        className="gap-2 font-semibold self-start"
      >
        {updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Profile
      </Button>
    </form>
  );
}

function PasswordForm() {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input id="currentPassword" type="password" {...register("currentPassword")} />
        {errors.currentPassword && (
          <span className="text-xs text-destructive">{errors.currentPassword.message}</span>
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
            <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-muted/30 border border-border/60 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
        Your password is hashed and never shared.
      </div>
      <Button type="submit" disabled={isSubmitting} className="gap-2 font-semibold self-start">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Update Password
      </Button>
    </form>
  );
}

/** Settings page body shared by the user, volunteer and admin dashboards. */
export function AccountSettings() {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={SettingsIcon} title="Settings" description="Manage your profile and account security" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary shrink-0">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Profile
                {user && <Badge variant="primary">{ROLE_LABEL[user.role]}</Badge>}
              </h2>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          {user ? <ProfileForm key={user.id} user={user} /> : <Loader2 className="size-5 animate-spin" />}
        </Card>

        <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Change Password</h2>
              <p className="text-xs text-muted-foreground">Use a strong password to keep your account secure</p>
            </div>
          </div>
          <PasswordForm />
        </Card>
      </div>
    </div>
  );
}
