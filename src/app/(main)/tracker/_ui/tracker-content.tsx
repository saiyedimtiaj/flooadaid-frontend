"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Radio, Search, MapPin, Phone, Users, LifeBuoy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SOSTracker from "@/components/sos/sos-tracker";
import { useSosTracking } from "@/lib/hooks/use-sos";

const LAST_SOS_ID_KEY = "floodaid:last-sos-id";

export function TrackerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("id");
    if (fromUrl) {
      setActiveId(fromUrl);
      return;
    }
    try {
      const stored = localStorage.getItem(LAST_SOS_ID_KEY);
      if (stored) setActiveId(stored);
    } catch {
      // localStorage unavailable — user can still paste an id manually
    }
  }, [searchParams]);

  const { data: sos, isLoading, isError } = useSosTracking(activeId);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = inputValue.trim();
    if (!id) return;
    router.push(`/tracker?id=${encodeURIComponent(id)}`);
    setActiveId(id);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-4">
          <Radio className="h-6 w-6" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          Track Your SOS Request
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter the reference ID you received when you submitted your request.
        </p>
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
              placeholder="Paste your SOS reference ID..."
              className="h-11 font-mono text-sm"
            />
          </div>
          <Button type="submit" className="h-11 gap-2 font-semibold shrink-0">
            <Search className="h-4 w-4" />
            Track
          </Button>
        </form>
      </Card>

      {activeId && isError && (
        <Card className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive font-semibold">
            No SOS request found with that ID. Double-check the reference and try again.
          </p>
        </Card>
      )}

      {activeId && !isError && sos && (
        <Card className="rounded-3xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">Request Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{sos.peopleCount} people</span>
            </div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground capitalize">{sos.helpType.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{sos.district?.nameEn}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{sos.phone}</span>
            </div>
          </div>
        </Card>
      )}

      {activeId && <SOSTracker isVisible={true} sos={sos} isLoading={isLoading} />}
    </div>
  );
}
