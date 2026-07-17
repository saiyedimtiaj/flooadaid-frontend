import { Metadata } from "next";
import SOSContent from "./_ui/sos-content";

export const metadata: Metadata = {
  title: "Emergency SOS — FloodAid BD",
  description:
    "Send an emergency rescue request with your GPS location during floods in Bangladesh.",
};

export default function SOSPage() {
  return <SOSContent />;
}
