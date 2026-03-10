import React, { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Edit,
  User,
  Building2,
  CalendarDays,
  Network,
  GraduationCap,
  Shield,
  ChevronRight,
  Database,
  Activity,
} from "lucide-react";
import { employees as mockEmployees } from "../data/mockData";
import { api } from "../lib/api";

interface EmployeeProfileProps {
  employeeId: string | null;
  employees: any[];
  onBack: () => void;
}

export default function EmployeeProfile({
  employeeId,
  employees,
  onBack,
}: EmployeeProfileProps) {
  const fallbackEmployee = useMemo(
    () =>
      employees.find((e) => e.id === employeeId) ||
      employees[0] ||
      mockEmployees[0],
    [employeeId, employees],
  );

  const [employee, setEmployee] = useState<any>(fallbackEmployee);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    setEmployee(fallbackEmployee);
  }, [fallbackEmployee]);

  useEffect(() => {
    if (!employeeId) return;
    let mounted = true;
    api
      .get<any>(`/api/employees/${employeeId}/profile`)
      .then((profile) => {
        if (!mounted) return;
        setEmployee({
          ...profile.employee,
          avatar: profile.employee.avatar || fallbackEmployee.avatar,
        });
        setPerformanceData(profile.performance || []);
      })
      .catch(() => {
        // Keep fallback data.
      });
    return () => {
      mounted = false;
    };
  }, [employeeId, fallbackEmployee.avatar]);

  return (
    <div className="flex flex-col h-full bg-background-light">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className="size-20 rounded-xl bg-slate-200 border-4 border-white shadow-sm bg-cover"
                style={{ backgroundImage: `url('${employee.avatar}')` }}
              ></div>
              <div className="absolute -bottom-1 -right-1 size-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  {employee.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                  在职
                </span>
              </div>
              <p className="text-slate-500 text-sm">
                {employee.role} <span className="mx-2 text-slate-300">|</span>{" "}
                ID:{" "}
                <span className="font-mono text-slate-700">{employee.id}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Mail size={16} /> 联系
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              返回列表
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Edit size={16} /> 编辑个人资料
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 flex flex-col gap-8 w-full">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <User className="text-primary" size={20} />
              <h3 className="font-bold text-slate-800">基础信息</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Email Address
                </span>
                <span className="text-sm font-medium">
                  {employee.name.toLowerCase().replace(" ", ".")}@company.com
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Phone Number
                </span>
                <span className="text-sm font-medium">+1 (555) 012-3456</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Birthday
                </span>
                <span className="text-sm font-medium">
                  October 14, 1990 (33 years old)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Building2 className="text-primary" size={20} />
              <h3 className="font-bold text-slate-800">组织信息</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Department
                </span>
                <span className="text-sm font-medium">
                  {employee.department} - Platform Team
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Reporting To
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="size-6 rounded-full bg-slate-200 bg-cover"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCSS5G_Bos3NJE-V8Fdc97kPg3o4HEdNkB0hDJB60XYV8iP_Cxw6iWGdGHr_naU2aBby5LZd9hdHleotlwf-TrHfezIgBT_W_nJNVU4sTeLa95eWe2eLXq6_S2bj4D-0VpWRWrAY-cHvLdzrkZ9_CVNg08r0anQEQlJZyGuzGXumF8rWOKujkNjcMHWkfkDuVNRRSn9szwxd7hEbWH0_VgMA64W8rIU6n_C8m1eA76NOSXK2H0airPmTgZKhOUQm5i_7FkPXMH3UMCS')",
                    }}
                  ></div>
                  <span className="text-sm font-medium">Sarah Jenkins</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Work Location
                </span>
                <span className="text-sm font-medium">
                  Headquarters, New York (Hybrid)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <CalendarDays className="text-primary" size={20} />
              <h3 className="font-bold text-slate-800">雇佣信息</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Hire Date
                </span>
                <span className="text-sm font-medium">
                  {employee.joinDate} (5.8 years)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Contract Type
                </span>
                <span className="text-sm font-medium">
                  Full-Time / Permanent
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Timezone
                </span>
                <span className="text-sm font-medium text-slate-600">
                  EST (UTC-5)
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-6 pt-4 flex gap-8">
            <button className="px-2 pb-4 text-sm font-bold border-b-2 border-primary text-primary">
              绩效
            </button>
            <button className="px-2 pb-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
              培训记录
            </button>
            <button className="px-2 pb-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
              考勤记录
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-base font-bold">历史绩效评分</h4>
                  <select className="text-xs bg-slate-50 border-slate-200 rounded py-1 outline-none">
                    <option>最近 3 年</option>
                    <option>所有时间</option>
                  </select>
                </div>
                <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-l border-slate-100">
                  {(performanceData.length > 0
                    ? performanceData
                    : [
                        { review_period: "2021", score: 3.2 },
                        { review_period: "2022", score: 4.5 },
                        { review_period: "2023-Q1", score: 4.8 },
                        { review_period: "2023-Q2", score: 3.9 },
                        { review_period: "2023-Q3", score: 4.9 },
                      ]
                  ).map((point, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors rounded-t-md relative group"
                      style={{ height: `${Math.max(20, Math.round((point.score / 5) * 100))}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {point.score}
                      </div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-medium">
                        {point.review_period}
                      </span>
                    </div>
                  ))}
                  {/* Legacy static bars removed after API integration */}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg flex flex-col gap-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                  统计摘要
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">平均评分</span>
                    <span className="text-lg font-bold">4.2 / 5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">上次评估日期</span>
                    <span className="text-sm font-semibold">Dec 15, 2023</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">完成目标数</span>
                    <span className="text-sm font-semibold text-green-600">
                      12 / 14
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <button className="w-full py-2 px-4 border border-primary text-primary text-xs font-bold rounded hover:bg-primary hover:text-white transition-all">
                    绩效
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Network className="text-slate-400" size={20} />
            <h3 className="font-bold text-slate-800">数据源血缘</h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <Database size={14} />
              <span>Workday (HRIS)</span>
              <span className="text-green-500">• 同步活跃</span>
            </div>
            <ChevronRight className="text-slate-300" size={16} />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <Activity size={14} />
              <span>SuccessFactors</span>
              <span className="text-slate-400">• 2小时前同步</span>
            </div>
            <ChevronRight className="text-slate-300" size={16} />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
              <User size={14} />
              <span>员工 360 视图</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            此个人资料汇总了来自 4 个权威来源的数据。数据每 4
            小时验证和同步一次。
          </p>
        </section>
      </div>
    </div>
  );
}
