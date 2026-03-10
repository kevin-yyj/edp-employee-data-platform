import React from "react";
import {
  LayoutDashboard,
  Users,
  Database,
  Bot,
  Settings,
  ServerCog,
  Shield,
} from "lucide-react";
import { ViewState } from "../App";

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "仪表盘", icon: LayoutDashboard },
    { id: "directory", label: "员工数据", icon: Users },
    { id: "datasource", label: "数据源", icon: Database },
    { id: "api", label: "API 管理", icon: ServerCog },
    { id: "permissions", label: "权限管理", icon: Shield },
    { id: "ai", label: "AI 助手", icon: Bot },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <Database size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">EDP</h1>
          <p className="text-xs text-slate-500">员工管理平台</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (currentView === "profile" && item.id === "directory");
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          <Settings size={20} />
          <span className="text-sm">设置</span>
        </button>
      </div>
    </aside>
  );
}
