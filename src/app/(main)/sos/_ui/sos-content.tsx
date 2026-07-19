"use client";

import { useState, type FormEvent } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import SOSHeader from "./sos-header";
import SOSLocation from "./sos-location";
import SOSForm from "./sos-form";
import SOSSubmit from "./sos-submit";
import SOSTracker from "@/components/sos/sos-tracker";
import { NearbyHelpPanel } from "@/components/sos/nearby-help-panel";
import SOSSidebarInfo from "./sos-sidebar-info";
import { sosFormSchema, SOSFormData } from "./types";
import { useCreateSos, useSosTracking } from "@/lib/hooks/use-sos";
import { ApiError } from "@/lib/api-client";
import type { HelpType } from "@/lib/types/api";

const LAST_SOS_ID_KEY = "floodaid:last-sos-id";

export default function SOSContent() {
  const form = useForm<SOSFormData>({
    resolver: zodResolver(sosFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      districtId: null,
      phone: "",
      peopleCount: null,
      helpTypes: [],
      description: "",
      photoPreviews: [],
      photoUrls: [],
    },
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [generatedSosId, setGeneratedSosId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const createSos = useCreateSos();
  const { data: trackedSos, isLoading: isTrackingLoading } = useSosTracking(generatedSosId);

  const formValues = form.watch();

  const getMissingRequirements = () => {
    const missing: string[] = [];
    if (formValues.name.trim().length < 2) missing.push("Your name");
    if (formValues.districtId === null) missing.push("Your district");
    if (location === null) missing.push("Your location on the map");
    if (formValues.peopleCount === null) missing.push("How many people");
    if (formValues.helpTypes.length === 0) missing.push("What help you need");
    if (!/^01\d{9}$/.test(formValues.phone)) {
      missing.push("A valid phone number");
    }
    return missing;
  };

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
        helpType: values.helpTypes.map((t) => t.toLowerCase()) as HelpType[],
        description: values.description || undefined,
        photoUrl: values.photoUrls[0] ?? undefined,
        photoUrls: values.photoUrls.length > 0 ? values.photoUrls : undefined,
      });

      setGeneratedSosId(sos.id);
      setHasSubmitted(true);
      try {
        localStorage.setItem(LAST_SOS_ID_KEY, sos.id);
      } catch {
        // localStorage unavailable — tracking still works via the id shown on screen
      }

      setTimeout(() => {
        document.getElementById("tracking-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Failed to submit SOS request. Please try again.");
    }
  };

  // Show all missing fields in a single toast on submit (nothing inline before submit).
  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const missing = getMissingRequirements();
    if (missing.length > 0) {
      toast.error("Please complete your SOS", {
        description: `Still needed: ${missing.join(", ")}.`,
      });
      // trigger RHF validation so field-level focus works, but no eager inline text
      void form.trigger();
      return;
    }
    void form.handleSubmit(submitSos)();
  };

  return (
    <div className="min-h-screen bg-background">
      <SOSHeader />
      <main className="container mx-auto py-8 flex flex-col gap-10">
        <FormProvider {...form}>
          {!hasSubmitted && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-8 flex flex-col gap-10">
                <SOSLocation
                  location={location}
                  setLocation={setLocation}
                  address={address}
                  setAddress={setAddress}
                />
                <SOSForm />
              </div>
              <div className="xl:col-span-4 xl:sticky xl:top-8">
                <SOSSidebarInfo />
              </div>
            </div>
          )}

          <div className="w-full">
            <SOSSubmit
              isSubmitted={hasSubmitted}
              isSubmitting={createSos.isPending}
              onSubmit={handleSubmit}
              sosId={generatedSosId}
              peopleCount={formValues.peopleCount}
              helpTypes={formValues.helpTypes}
              address={address}
            />
          </div>

          {hasSubmitted && (
            <div className="w-full max-w-md mx-auto">
              <NearbyHelpPanel location={location} />
            </div>
          )}
        </FormProvider>
        <SOSTracker isVisible={hasSubmitted} sos={trackedSos} isLoading={isTrackingLoading} />
      </main>
    </div>
  );
}
