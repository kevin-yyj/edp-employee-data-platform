export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email?: string | null;
  country: string;
  department: string;
  role: string;
  joinDate: string;
  status: "Onboarded" | "Resigned" | "On Leave";
  avatar?: string | null;
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  syncMode: string;
  status: "connected" | "disconnected";
  successRate: number;
  lastSyncAt?: string | null;
}
