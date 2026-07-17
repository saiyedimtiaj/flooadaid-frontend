"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import SOSHeader from "./sos-header";
import SOSLocation from "./sos-location";
import SOSForm from "./sos-form";
import SOSSubmit from "./sos-submit";
import SOSTracker from "@/components/sos/sos-tracker";
import SOSSidebarInfo from "./sos-sidebar-info";
import { sosFormSchema, SOSFormData } from "./types";
import { useCreateSos, useSosTracking } from "@/lib/hooks/use-sos";
import { ApiError } from "@/lib/api-client";
import type { HelpType } from "@/lib/types/api";

const LAST_SOS_ID_KEY = "floodaid:last-sos-id";

export default function SOSContent() {
  const form = useForm<SOSFormData>({
    resolver: zodResolver(sosFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      districtId: null,
      phone: "",
      peopleCount: null,
      helpTypes: [],
      description: "",
      photoFile: null,
      photoPreview: null,
      photoUrl: null,
    },
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [generatedSosId, setGeneratedSosId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const createSos = useCreateSos();
  const { data: trackedSos, isLoading: isTrackingLoading } = useSosTracking(generatedSosId);

  const formValues = form.watch();
  const isFormValid = form.formState.isValid && location !== null;

  const getMissingRequirements = () => {
    const missing: string[] = [];
    if (formValues.name.trim().length < 2) missing.push("Your name");
    if (formValues.districtId === null) missing.push("District");
    if (location === null) missing.push("Location sharing");
    if (formValues.peopleCount === null) missing.push("Number of people");
    if (formValues.helpTypes.length === 0) missing.push("Type of help needed");
    if (!/^01\d{9}$/.test(formValues.phone)) {
      missing.push("Valid phone number");
    }
    return missing;
  };

  const handleSubmit = form.handleSubmit(async (values) => {
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
        photoUrl: values.photoUrl ?? undefined,
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
  });

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
                <SOSForm onSubmit={handleSubmit} />
              </div>
              <div className="xl:col-span-4 xl:sticky xl:top-8">
                <SOSSidebarInfo />
              </div>
            </div>
          )}

          <div className="w-full">
            <SOSSubmit
              isSubmitted={hasSubmitted}
              missingRequirements={getMissingRequirements()}
              isSubmitting={createSos.isPending}
              isValid={isFormValid}
              onSubmit={handleSubmit}
              sosId={generatedSosId}
              peopleCount={formValues.peopleCount}
              helpTypes={formValues.helpTypes}
              address={address}
            />
          </div>
        </FormProvider>
        <SOSTracker isVisible={hasSubmitted} sos={trackedSos} isLoading={isTrackingLoading} />
      </main>
    </div>
  );
}
