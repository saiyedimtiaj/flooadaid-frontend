"use client";

import { UserSearch } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { MissingPersonsBoard } from "@/components/missing-persons/missing-persons-board";

export default function AdminMissingPersonsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={UserSearch}
        title="Missing Persons"
        description="Review reports, see full contact numbers and mark families as reunited"
      />
      <MissingPersonsBoard embedded />
    </div>
  );
}
