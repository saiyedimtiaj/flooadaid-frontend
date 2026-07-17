"use client";

import { useForm, Controller } from "react-hook-form";
import { UserRound, ShieldCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DistrictSelect } from "@/components/dashboard/district-select";
import { PageHeader } from "@/components/dashboard/page-header";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import {
  useMyVolunteerProfile,
  useRegisterVolunteer,
  useUpdateVolunteerAvailability,
  type RegisterVolunteerInput,
} from "@/lib/hooks/use-volunteers";

const SKILL_OPTIONS = ["medical", "boat_operation", "cooking", "logistics", "general"];

function RegisterForm() {
  const registerVolunteer = useRegisterVolunteer();
  const { register, handleSubmit, control } = useForm<RegisterVolunteerInput>({
    defaultValues: { skills: [], availableFrom: "06:00", availableTo: "18:00" },
  });

  return (
    <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary shrink-0">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Complete Your Volunteer Profile</h2>
          <p className="text-xs text-muted-foreground">
            Tell us your skills, district, and availability
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((values) => registerVolunteer.mutate(values))}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => (
              <label
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-semibold capitalize cursor-pointer has-checked:bg-primary has-checked:text-primary-foreground has-checked:border-primary"
              >
                <input type="checkbox" value={skill} className="sr-only" {...register("skills")} />
                {skill.replace("_", " ")}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>District</Label>
          <Controller
            name="districtId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <DistrictSelect value={field.value} onChange={field.onChange} />}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Available From</Label>
            <Input type="time" {...register("availableFrom")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Available To</Label>
            <Input type="time" {...register("availableTo")} />
          </div>
        </div>

        <Button type="submit" disabled={registerVolunteer.isPending} className="font-semibold self-start mt-2">
          Register as Volunteer
        </Button>
      </form>
    </Card>
  );
}

export default function VolunteerProfilePage() {
  const { data: user } = useCurrentUser();
  const isVolunteer = user?.role === "VOLUNTEER";
  const { data: profile, isLoading } = useMyVolunteerProfile(isVolunteer);
  const updateAvailability = useUpdateVolunteerAvailability();

  if (isVolunteer && isLoading) {
    return <Skeleton className="h-64 w-full max-w-xl rounded-3xl" />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader icon={UserRound} title="My Profile" description="Register as a FloodAid volunteer" />
        <RegisterForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <PageHeader icon={UserRound} title="My Profile" description="Your volunteer profile and availability" />

      <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 text-primary shrink-0">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">{user?.name}</h2>
            <p className="text-xs text-muted-foreground">{profile.district?.nameEn}</p>
          </div>
          <Badge variant={profile.verified ? "success" : "warning"} className="ml-auto">
            {profile.verified ? (
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            ) : (
              "Pending Verification"
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Skills
            </span>
            <span className="font-semibold text-foreground capitalize">
              {profile.skills.join(", ") || "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Total Assignments
            </span>
            <span className="font-semibold text-foreground">{profile.totalAssignments}</span>
          </div>
          {(profile.availableFrom || profile.availableTo) && (
            <div className="col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Availability Window
              </span>
              <span className="font-semibold text-foreground inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {profile.availableFrom ?? "—"} – {profile.availableTo ?? "—"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border p-4">
          <div>
            <p className="text-sm font-bold text-foreground">Currently available</p>
            <p className="text-xs text-muted-foreground">Toggle off if you can&apos;t take new assignments</p>
          </div>
          <Switch
            checked={profile.isAvailable}
            onCheckedChange={(checked) =>
              updateAvailability.mutate({ id: profile.id, isAvailable: checked })
            }
          />
        </div>
      </Card>
    </div>
  );
}
