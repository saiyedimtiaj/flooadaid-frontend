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
  status: SosStatus;
  priority: SosPriority;
  assignedToId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  district?: District;
  assignedTo?: { id: string; name: string; phone: string } | null;
}

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
