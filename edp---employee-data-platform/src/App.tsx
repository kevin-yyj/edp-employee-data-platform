import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./views/Dashboard";
import EmployeeDirectory from "./views/EmployeeDirectory";
import DataSource from "./views/DataSource";
import EmployeeProfile from "./views/EmployeeProfile";
import AIAssistantCoze from "./views/AIAssistantCoze";
import APIManagement from "./views/APIManagement";
import PermissionManagement from "./views/PermissionManagement";
import { employees as initialEmployees } from "./data/mockData";
import { api } from "./lib/api";
import { Employee } from "./types";

export type ViewState =
  | "dashboard"
  | "directory"
  | "datasource"
  | "profile"
  | "ai"
  | "api"
  | "permissions";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [employees, setEmployees] = useState<any[]>(
    initialEmployees.map((item: any) => ({
      ...item,
      employeeCode: item.id,
    })),
  );

  const loadEmployees = useCallback(async () => {
    try {
      const remoteEmployees = await api.get<Employee[]>("/api/employees");
      setEmployees(
        remoteEmployees.map((item) => ({
          id: item.id,
          employeeCode: item.employeeCode,
          name: item.name,
          country: item.country,
          department: item.department,
          role: item.role,
          joinDate: item.joinDate,
          status: item.status,
          avatar: item.avatar,
        })),
      );
    } catch {
      // Keep static fallback data when backend or auth is unavailable.
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const navigateToProfile = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView("profile");
  };

  const handleAddEmployee = async (emp: any) => {
    try {
      await api.post("/api/employees", {
        employeeCode: emp.employeeCode || emp.id,
        name: emp.name,
        email: emp.email,
        country: emp.country,
        department: emp.department,
        role: emp.role,
        joinDate: emp.joinDate,
        status: emp.status,
        avatar: emp.avatar,
      });
      await loadEmployees();
    } catch {
      setEmployees([emp, ...employees]);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "directory":
        return (
          <EmployeeDirectory
            employees={employees}
            onSelectEmployee={navigateToProfile}
            onAddEmployee={handleAddEmployee}
          />
        );
      case "datasource":
        return <DataSource />;
      case "api":
        return <APIManagement />;
      case "permissions":
        return <PermissionManagement />;
      case "profile":
        return (
          <EmployeeProfile
            employeeId={selectedEmployeeId}
            employees={employees}
            onBack={() => setCurrentView("directory")}
          />
        );
      case "ai":
        return <AIAssistantCoze />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light text-slate-900">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView !== "ai" && (
          <TopBar
            currentView={currentView}
            employees={employees}
            onSelectEmployee={navigateToProfile}
          />
        )}
        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>
    </div>
  );
}
