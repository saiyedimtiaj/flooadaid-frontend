"use client";

import { useState, type FormEvent } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import SOSHeader from "./sos-header";
import { ContactStep, DetailsStep, LocationStep, SituationStep } from "./sos-steps";
import { EmergencyNumbers, SendButton, SOSSummary } from "./sos-summary";
import { SOSSuccess } from "./sos-success";
import { MySosRequests } from "@/components/sos/my-sos-requests";
import { sosFormSchema, SOSFormData } from "./types";
import { useCreateSos, useSosTracking } from "@/lib/hooks/use-sos";
import { rememberSosId } from "@/lib/my-sos-store";
import { ApiError } from "@/lib/api-client";
import type { HelpType } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

const EMPTY: SOSFormData = {
  name: "",
  districtId: null,
  phone: "",
  peopleCount: null,
  helpTypes: [],
  description: "",
  photoPreviews: [],
  photoUrls: [],
};

export default function SOSContent() {
  const form = useForm<SOSFormData>({ resolver: zodResolver(sosFormSchema), mode: "onSubmit", defaultValues: EMPTY });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [sosId, setSosId] = useState<string | null>(null);
  const createSos = useCreateSos();
  const { t } = useT();
  const { data: tracked, isLoading: trackingLoading } = useSosTracking(sosId);
  const v = useWatch({ control: form.control }) as SOSFormData;

  const checklist = [
    { label: t("sos.missing.location"), done: location !== null },
    { label: t("sos.missing.district"), done: v.districtId !== null },
    { label: t("sos.missing.people"), done: v.peopleCount !== null },
    { label: t("sos.missing.help"), done: v.helpTypes.length > 0 },
    { label: t("sos.missing.name"), done: v.name.trim().length >= 2 },
    { label: t("sos.missing.phone"), done: /^01\d{9}$/.test(v.phone) },
  ];

  const submitSos = async (values: SOSFormData) => {
    if (location === null || values.districtId === null) return;
    try {
      const sos = await createSos.mutateAsync({
        name: values.name,
        phone: values.phone,
        latitude: location.lat,
        longitude: location.lng,
        addressText: address || undefined,
        districtId: values.districtId,
        peopleCount: values.peopleCount!,
        helpType: values.helpTypes.map((h) => h.toLowerCase()) as HelpType[],
        description: values.description || undefined,
        photoUrls: values.photoUrls.length > 0 ? values.photoUrls : undefined,
      });
      rememberSosId(sos.id);
      window.dispatchEvent(new Event("floodaid:sos-saved"));
      setSosId(sos.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Failed to submit SOS request. Please try again.");
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const missing = checklist.filter((c) => !c.done).map((c) => c.label);
    if (missing.length > 0) {
      toast.error(t("sos.incomplete"), { description: `${t("sos.stillNeeded")} ${missing.join(", ")}.` });
      void form.trigger();
      return;
    }
    void form.handleSubmit(submitSos)();
  };

  const startOver = () => {
    form.reset(EMPTY);
    setLocation(null);
    setAddress("");
    setSosId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-28 xl:pb-0">
      <SOSHeader />
      <main className="container relative z-10 mx-auto -mt-10 px-4 pb-16 sm:px-6 lg:px-8">
        <FormProvider {...form}>
          {sosId ? (
            <SOSSuccess
              sosId={sosId}
              sos={tracked}
              isLoading={trackingLoading}
              summary={{ people: v.peopleCount, help: v.helpTypes, address }}
              location={location}
              onNew={startOver}
            />
          ) : (
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
              <div className="flex flex-col gap-6 xl:col-span-8">
                <LocationStep location={location} setLocation={setLocation} address={address} setAddress={setAddress} />
                <SituationStep />
                <ContactStep />
                <DetailsStep />
              </div>
              <aside className="flex flex-col gap-6 xl:sticky xl:top-28 xl:col-span-4">
                <div className="hidden xl:block">
                  <SOSSummary items={checklist} onSubmit={() => handleSubmit()} isSubmitting={createSos.isPending} />
                </div>
                <MySosRequests compact />
                <EmergencyNumbers />
              </aside>
            </div>
          )}
        </FormProvider>
      </main>

      {!sosId && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur xl:hidden">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="shrink-0 text-center">
              <p className="text-lg font-bold tabular-nums text-foreground">
                {checklist.filter((c) => c.done).length}/{checklist.length}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("sos.progressDone")}</p>
            </div>
            <SendButton onClick={() => handleSubmit()} isSubmitting={createSos.isPending} className="h-12" />
          </div>
        </div>
      )}
    </div>
  );
}
