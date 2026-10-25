"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Radio, Search, MapPin, Phone, Users, LifeBuoy, EyeOff, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SOSTracker from "@/components/sos/sos-tracker";
import { useCancelOwnSos, useSosTracking } from "@/lib/hooks/use-sos";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useT } from "@/lib/i18n/use-t";

const LAST_SOS_ID_KEY = "floodaid:last-sos-id";

function readStoredId(): string | null {
  try {
    return localStorage.getItem(LAST_SOS_ID_KEY);
  } catch {
    // localStorage unavailable — user can still paste an id manually
    return null;
  }
}

const noopSubscribe = () => () => {};

export function TrackerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, pick, num } = useT();
  const [inputValue, setInputValue] = useState("");
  const [typedId, setTypedId] = useState<string | null>(null);
  // Last submitted id from this browser; null on the server render.
  const storedId = useSyncExternalStore(noopSubscribe, readStoredId, () => null);

  const activeId = typedId ?? searchParams.get("id") ?? storedId;

  const { data: sos, isLoading, isError } = useSosTracking(activeId);
  const { data: user } = useCurrentUser();
  const cancel = useCancelOwnSos();

  const isOwner = !!sos && !sos.redacted && !!user && sos.userId === user.id;
  const canCancel = isOwner && sos.status !== "RESOLVED" && sos.status !== "CANCELLED";

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = inputValue.trim();
    if (!id) return;
    router.push(`/tracker?id=${encodeURIComponent(id)}`);
    setTypedId(id);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-4">
          <Radio className="h-6 w-6" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          {t("tracker.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{t("tracker.subtitle")}</p>
      </div>

      <Card className="rounded-3xl border border-border bg-card p-6">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <Label htmlFor="sos-id" className="sr-only">
              SOS reference ID
            </Label>
            <Input
              id="sos-id"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("tracker.placeholder")}
              className="h-11 font-mono text-sm"
            />
          </div>
          <Button type="submit" className="h-11 gap-2 font-semibold shrink-0">
            <Search className="h-4 w-4" />
            {t("tracker.track")}
          </Button>
        </form>
      </Card>

      {activeId && isError && (
        <Card className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive font-semibold">{t("tracker.notFound")}</p>
        </Card>
      )}

      {activeId && !isError && sos && (
        <Card className="rounded-3xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">{t("tracker.details")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {num(sos.peopleCount)} {t("tracker.people")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {sos.helpType.map((h) => t(`sos.help.${h}`)).join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {sos.district && pick(sos.district.nameEn, sos.district.nameBn)}
              </span>
            </div>
            {!sos.redacted && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{sos.phone}</span>
              </div>
            )}
          </div>

          {sos.redacted && (
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl p-3">
              <EyeOff className="h-4 w-4 shrink-0 mt-px" />
              {t("tracker.privacy")}
            </p>
          )}

          {canCancel && (
            <Button
              variant="destructive-outline"
              size="sm"
              className="mt-4 gap-1.5"
              isLoading={cancel.isPending}
              onClick={() => {
                if (window.confirm(t("tracker.cancelConfirm"))) cancel.mutate(sos.id);
              }}
            >
              <XCircle className="h-4 w-4" />
              {t("tracker.cancel")}
            </Button>
          )}
        </Card>
      )}

      {activeId && <SOSTracker isVisible={true} sos={sos} isLoading={isLoading} />}
    </div>
  );
}
