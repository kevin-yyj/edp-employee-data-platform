import React, { useState, useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { ViewState } from "../App";

interface TopBarProps {
  currentView: ViewState;
  employees: any[];
  onSelectEmployee: (id: string) => void;
}

export default function TopBar({
  currentView,
  employees,
  onSelectEmployee,
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredEmployees = employees
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.employeeCode || emp.id)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    )
    .slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
      <div
        className="flex items-center gap-4 flex-1 max-w-xl relative"
        ref={dropdownRef}
      >
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="搜索员工工号或姓名..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
          />
        </div>
        {showDropdown && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-100 last:border-0"
                  onClick={() => {
                    onSelectEmployee(emp.id);
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                >
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="size-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {emp.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {emp.employeeCode || emp.id} · {emp.department}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                未找到匹配的员工
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">
              阿里克斯·里维拉
            </p>
            <p className="text-xs text-slate-500 mt-1">HR 总监</p>
          </div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNzN2AtJ2LfTeUMNq0gw76caEeFp7R45PHwSc3AFY8jJSlfb7Jp7ivXqNTEwXpXtFVqi2fUb49Ufwx2rUYaAdFEP6BMn38P1u_Cej6iltdtGgExsdlXwTuR8t_8YqBqXP4iv85EJ9AbZkWsUYDz0ky_tQN9r6dxFWSKMUDn8jSlTq7qlg0b9OwIgNYqrRbq8m9al0jwNBJ1S6xyUstC3AUWlYWB7d5ELACKox5YBtOVK6dIWa7ZXFaXfKh5SZ7lsPiUmHsa3ZOOdRb"
            alt="User Profile"
            className="size-10 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
