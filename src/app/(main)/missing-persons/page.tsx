import type { Metadata } from "next";
import { MissingPersonsBoard } from "@/components/missing-persons/missing-persons-board";

export const metadata: Metadata = {
  title: "Missing & Found Persons — FloodAid BD",
  description:
    "Search for people separated by floods, report someone missing, or post someone you have found and are keeping safe.",
};

export default function MissingPersonsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <MissingPersonsBoard />
    </div>
  );
}
