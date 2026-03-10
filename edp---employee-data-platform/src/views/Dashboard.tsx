import React, { useEffect, useState } from "react";
import {
  Calendar,
  Download,
  Users,
  TrendingUp,
  UserMinus,
  RefreshCw,
  History,
  MoreHorizontal,
  Cloud,
  AtSign,
  FileText,
  ChevronRight,
} from "lucide-react";
import { api } from "../lib/api";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>({
    totalEmployees: 12450,
    turnoverRate: 4.2,
    connectedSources: 3,
    totalSources: 4,
    avgSourceSuccessRate: 99.6,
    recentJobs: [],
  });

  useEffect(() => {
    api
      .get<any>("/api/dashboard/metrics")
      .then((remote) => setMetrics(remote))
      .catch(() => {
        // Keep local fallback values when backend is not ready.
      });
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">行政概览</h2>
          <p className="text-slate-500">全组织的实时指标</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
            <Calendar size={16} /> 最近 30 天
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
            <Download size={16} /> 导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users size={24} />
            </div>
            <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} /> +12.5%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">员工总数</p>
          <h3 className="text-3xl font-bold mt-1">
            {metrics.totalEmployees.toLocaleString()}
          </h3>
          <div className="mt-4 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "75%" }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <UserMinus size={24} />
            </div>
            <span className="text-rose-500 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} /> +0.2%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">流失率</p>
          <h3 className="text-3xl font-bold mt-1">{metrics.turnoverRate}%</h3>
          <div className="mt-4 flex items-end gap-1 h-8">
            <div className="flex-1 bg-amber-100 h-[40%] rounded-t-sm"></div>
            <div className="flex-1 bg-amber-100 h-[60%] rounded-t-sm"></div>
            <div className="flex-1 bg-amber-100 h-[50%] rounded-t-sm"></div>
            <div className="flex-1 bg-amber-200 h-[70%] rounded-t-sm"></div>
            <div className="flex-1 bg-amber-400 h-[90%] rounded-t-sm"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <RefreshCw size={24} />
            </div>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              实时
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">数据同步状态</p>
          <h3 className="text-3xl font-bold mt-1">
            {metrics.connectedSources}/{metrics.totalSources}
          </h3>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <History size={14} /> 平均成功率：{metrics.avgSourceSuccessRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold">各部门员工分布</h4>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="space-y-6">
            {[
              {
                label: "工程",
                value: "4,210 (34%)",
                width: "85%",
                color: "bg-primary",
              },
              {
                label: "销售与市场",
                value: "3,120 (25%)",
                width: "65%",
                color: "bg-primary/70",
              },
              {
                label: "运营",
                value: "2,840 (22%)",
                width: "55%",
                color: "bg-primary/50",
              },
              {
                label: "人力资源",
                value: "1,280 (10%)",
                width: "25%",
                color: "bg-primary/30",
              },
            ].map((dept, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{dept.label}</span>
                  <span className="text-slate-500">{dept.value}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dept.color} rounded-full`}
                    style={{ width: dept.width }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold">雇佣状态</h4>
            <select className="bg-transparent border-none text-xs font-medium focus:ring-0 text-slate-500 cursor-pointer outline-none">
              <option>本季度</option>
              <option>本年度</option>
            </select>
          </div>
          <div className="flex items-center justify-around h-full py-4">
            <div className="relative size-48">
              <svg
                className="size-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#1a90ff"
                  strokeWidth="20"
                  strokeDasharray="175 251"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#1a90ff4d"
                  strokeWidth="20"
                  strokeDasharray="50 251"
                  strokeDashoffset="-175"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#fbbf24"
                  strokeWidth="20"
                  strokeDasharray="26 251"
                  strokeDashoffset="-225"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">12.4k</span>
                <span className="text-[10px] text-slate-400 uppercase">
                  总计
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-primary"></div>
                <div>
                  <p className="text-xs text-slate-500 leading-none">入职</p>
                  <p className="text-sm font-bold">70%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-primary/30"></div>
                <div>
                  <p className="text-xs text-slate-500 leading-none">试用期</p>
                  <p className="text-sm font-bold">20%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-amber-400"></div>
                <div>
                  <p className="text-xs text-slate-500 leading-none">离职</p>
                  <p className="text-sm font-bold">10%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold">最近同步任务</h4>
          <button className="text-primary text-sm font-medium hover:underline">
            查看所有任务
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">源系统</th>
                <th className="px-6 py-4">同步记录数</th>
                <th className="px-6 py-4">耗时</th>
                <th className="px-6 py-4">时间戳</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(metrics.recentJobs || []).length === 0 && (
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600" colSpan={6}>
                    暂无任务数据（后端未连接时显示静态示例）
                  </td>
                </tr>
              )}
              {(metrics.recentJobs || []).map((job: any) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{job.sourceName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {job.recordsSynced?.toLocaleString() || "--"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {job.durationSeconds}s
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        job.status === "success"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {job.status === "success" ? "成功" : "失败"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {(metrics.recentJobs || []).length === 0 && (
                <>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                      <Cloud size={16} />
                    </div>
                    <span className="text-sm font-medium">Workday HCM</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">8,420</td>
                <td className="px-6 py-4 text-sm text-slate-600">1m 24s</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  今天, 09:42 AM
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                    成功
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                      <AtSign size={16} />
                    </div>
                    <span className="text-sm font-medium">
                      Microsoft Entra ID
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">12,100</td>
                <td className="px-6 py-4 text-sm text-slate-600">3m 12s</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  今天, 09:42 AM
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                    成功
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-orange-50 flex items-center justify-center text-orange-600">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm font-medium">薪资导出 CSV</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">--</td>
                <td className="px-6 py-4 text-sm text-slate-600">0m 04s</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  昨天, 11:50 PM
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold">
                    失败
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
