export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface Division {
  id: number;
  nameEn: string;
  nameBn: string;
}

export interface District {
  id: number;
  divisionId: number;
  nameEn: string;
  nameBn: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Upazila {
  id: number;
  districtId: number;
  nameEn: string;
  nameBn: string;
  latitude: number | null;
  longitude: number | null;
}

export type AlertSeverity = "NORMAL" | "WATCH" | "WARNING" | "DANGER" | "CRITICAL";

export interface Alert {
  id: string;
  title: string;
  titleBn: string | null;
  description: string;
  severity: AlertSeverity;
  districtId: number;
  upazilaId: number | null;
  waterLevelCm: number | null;
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  district: District;
}

export interface Shelter {
  id: string;
  name: string;
  nameBn: string | null;
  address: string;
  districtId: number;
  upazilaId: number | null;
  latitude: number;
  longitude: number;
  capacity: number;
  currentOccupancy: number;
  contactPhone: string | null;
  contactName: string | null;
  hasFood: boolean;
  hasWater: boolean;
  hasMedical: boolean;
  hasElectricity: boolean;
  hasToilet: boolean;
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  district: District;
}

export type SosStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
export type SosPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type PeopleCount = "1" | "2-5" | "5-10" | "10+";
export type HelpType = "rescue" | "food" | "medicine" | "water";

export interface SosRequest {
  id: string;
  userId: string | null;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  addressText: string | null;
  districtId: number;
  peopleCount: PeopleCount;
  helpType: HelpType[];
  description: string | null;
  photoUrl: string | null;
  photoUrls?: string[];
  manualEntry?: boolean;
  status: SosStatus;
  priority: SosPriority;
  assignedToId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  district?: District;
  assignedTo?: { id: string; name: string; phone: string } | null;
  history?: SosHistoryEntry[];
}

export interface SosHistoryEntry {
  id: string;
  status: SosStatus;
  note: string | null;
  createdAt: string;
  changedBy: { name: string; role: "ADMIN" | "VOLUNTEER" | "USER" } | null;
}

/**
 * What GET /sos/:id returns. Admins, the assigned volunteer and the requester
 * get the full record (`redacted: false`); anyone else tracking by id gets
 * status + timeline only, without phone, GPS or name.
 */
export type SosTracking =
  | (SosRequest & { redacted: false; history: SosHistoryEntry[] })
  | {
      redacted: true;
      id: string;
      status: SosStatus;
      priority: SosPriority;
      peopleCount: PeopleCount;
      helpType: HelpType[];
      districtId: number;
      district: District;
      manualEntry: boolean;
      createdAt: string;
      updatedAt: string;
      resolvedAt: string | null;
      assignedTo: { id: string; name: string } | null;
      history: SosHistoryEntry[];
    };

export interface ReliefItem {
  item: string;
  quantity: number;
  unit: string;
}

export interface ReliefLog {
  id: string;
  districtId: number;
  upazilaId: number | null;
  locationName: string;
  itemsDistributed: ReliefItem[];
  familiesServed: number;
  distributedBy: string;
  distributionDate: string;
  photoUrls: string[];
  notes: string | null;
  createdById: string;
  createdAt: string;
  district: District;
}

export interface ReliefCoverage {
  districtId: number;
  districtName: string;
  distributions: number;
  familiesServed: number;
  lastDistributionDate: string | null;
  covered: boolean;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  skills: string[];
  availableFrom: string | null;
  availableTo: string | null;
  districtId: number;
  isAvailable: boolean;
  totalAssignments: number;
  verified: boolean;
  createdAt: string;
  user?: { id: string; name: string; email: string; phone: string | null };
  district?: District;
}

export type NotificationType = "ALERT" | "SOS_UPDATE" | "ASSIGNMENT" | "GENERAL";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  activeAlerts: number;
  openShelters: number;
  totalSosRequests: number;
  resolvedSosRequests: number;
  activeVolunteers: number;
  reliefDistributions: number;
  districtsAffected: number;
  peopleCurrentlySheltered: number;
  totalShelterCapacity: number;
}

export interface SosSummary {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  resolvedCount: number;
  avgResolutionHours: number | null;
}

export interface ReliefSummary {
  totalDistributions: number;
  totalFamiliesServed: number;
  districtsServed: number;
  itemTotals: Record<string, { quantity: number; unit: string }>;
}

export interface PublicSosStats {
  total: number;
  resolved: number;
}

export interface PublicVolunteerStats {
  total: number;
  districtsCovered: number;
}

// ── Missing / found persons ──────────────────────────────────────────────

export type MissingPersonType = "MISSING" | "FOUND";
export type MissingPersonStatus = "OPEN" | "REUNITED" | "CLOSED";

export interface MissingPerson {
  id: string;
  type: MissingPersonType;
  status: MissingPersonStatus;
  name: string;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  description: string | null;
  photoUrls: string[];
  lastSeenText: string;
  latitude: number | null;
  longitude: number | null;
  districtId: number;
  district: District;
  reporterName: string;
  /** Masked (017•••••678) unless the viewer is admin, volunteer or the reporter. */
  reporterPhone: string;
  contactHidden: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MissingPersonSummary {
  openMissing: number;
  openFound: number;
  reunited: number;
}

// ── Shelter supply requests ──────────────────────────────────────────────

export type SupplyUrgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type SupplyRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "FULFILLED";

export interface SupplyRequest {
  id: string;
  shelterId: string;
  items: ReliefItem[];
  urgency: SupplyUrgency;
  note: string | null;
  status: SupplyRequestStatus;
  reviewNote: string | null;
  requestedById: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  shelter: {
    id: string;
    name: string;
    nameBn: string | null;
    address: string;
    capacity: number;
    currentOccupancy: number;
    district: { id: number; nameEn: string; nameBn: string };
  };
  requestedBy: { id: string; name: string; phone: string | null };
  reviewedBy: { id: string; name: string } | null;
  assignments: {
    id: string;
    item: string;
    quantity: number;
    unit: string;
    status: "ASSIGNED" | "DELIVERED" | "CANCELLED";
    deliveredAt: string | null;
    volunteer: { id: string; name: string; phone: string | null };
  }[];
}

// ── Live situation (public, aggregate only) ──────────────────────────────

export interface DistrictOverview {
  districtId: number;
  nameEn: string;
  nameBn: string;
  divisionEn: string;
  divisionBn: string;
  latitude: number | null;
  longitude: number | null;
  alert: {
    severity: AlertSeverity;
    title: string;
    titleBn: string | null;
    waterLevelCm: number | null;
    count: number;
  } | null;
  openSos: number;
  shelters: { open: number; capacity: number; occupancy: number };
  relief: { distributions: number; familiesServed: number; lastDistributionDate: string | null };
  openMissing: number;
}

export interface DistrictOverviewResponse {
  generatedAt: string;
  lastAlertUpdate: string | null;
  districts: DistrictOverview[];
}

export interface PublicSummary {
  districtsOnAlert: number;
  sheltersOpen: number;
  peopleSheltered: number;
  shelterCapacity: number;
  sosTotal: number;
  sosResolved: number;
  sosResolvedToday: number;
  sosOpen: number;
  verifiedVolunteers: number;
  familiesServed: number;
  missingOpen: number;
  reunited: number;
  generatedAt: string;
}
