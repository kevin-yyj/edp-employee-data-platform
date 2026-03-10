import React, { useEffect, useState } from "react";
import { Plus, Settings, RefreshCw, FileText, Activity, X } from "lucide-react";
import { api } from "../lib/api";

const initialDataSources = [
  {
    id: 1,
    name: "Workday HRIS",
    status: "connected",
    syncTime: "2h ago",
    successRate: "99.9%",
    iconUrl:
      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqyHpz5lkNujBsw9OX9c0_PcTihdDLVIzBled8f1K9cV0rqfJoXWEG1JAD30ejzP-pQ7AqXe-6KoM3sS4E5gzYv1YgvEB8vE3cSMa9gni_N_L14Wmzz6RWtKJehccUNzqAnm6xJlB0uU8cFzFzXaQdGFaKWz3E1IWasbZpjBqX7JPQ8qGYQLtsrTzWzqwHUXd1d40YvG2h81Row-kpfEOWjoB72MyclEeP3irnzVdryxDBKanv_YyV_opuKhisZU1O4Jx5L-U03hxH')",
    colorClass: "bg-blue-50 border-blue-100",
  },
  {
    id: 2,
    name: "Greenhouse Recruiting",
    status: "connected",
    syncTime: "1h ago",
    successRate: "100%",
    iconUrl:
      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRXjRbjwhnTrOwdqT8_Qi9iQsrrKoVyJzk0fRW4Mzb75wL_6784qyUSSl1r9cmlBDRO1Ph0U-uFGTI1nEi-d1KiFAOzrrDDbOhYN1BEjvvxPj3wthYlVB6Ghc_2cla4gpYZFD3ceJXsjPGt1BNlDy20Pq2wfUUpJy83MOwv1pKi3dNupZPticeiWL38tTA0pkIFb06TtshLtZ3NbDvu3UfxRyu0x4lJ3m0CJXdgwC8UNMUx-jS1kns2xlVVWlTaaxb1YSWEIQTF0m5')",
    colorClass: "bg-green-50 border-green-100",
  },
  {
    id: 3,
    name: "Lattice Performance",
    status: "disconnected",
    syncTime: "1d ago (Failed)",
    successRate: "0%",
    iconUrl:
      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBX2szqUzcfbc3uB-52K7kgDDxN2paTuwdu71r8baEds4W3s1Y35hF1C61xOYNJFAlVTSA8VMLTGVjEkEds7qaeSClQSPpG8HV6dvjud8kH06nrkXaepUqQZQeSd3mWVsDavXzmPHtkva6IFa0ikzl1Cv9gyXK4cNb1LY5stnymZyuXtZ-5bFR7sE6KnH0q3HGeLM6Q4bwUdxojsv4a9XxBzgegaGShMy0bwOYadLCrCMhCqGsTic9EhI5BXJOeqHFPH9WucteKquPd')",
    colorClass: "bg-pink-50 border-pink-100",
  },
  {
    id: 4,
    name: "Kronos Attendance",
    status: "connected",
    syncTime: "30m ago",
    successRate: "98.5%",
    iconUrl:
      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAvs7RO8i2mTAIGCU_I76F6_H0uyYlqCcZGbmbSsETrZzrAiMw8LICA9fE3TnjWW-p3nMR6YR2OTKNaTc1pnKFwaFP_Yscwr__AbtzAyKKK1qNPS0ckbf5q7-zXEtRfKRWJI6pqGwJhnhf89mC43jaj75LNlZVrCHEx4fKeGA_QL7LlSyoxM5H1B59Ge3HJGNNFFA0LRDAu1RX2-r1CX5N0MZhXAfFlTzl5SBmPduAfVbq1DpIDwqc5XqNAcsyAQuc0vKRH7gCevLy')",
    colorClass: "bg-orange-50 border-orange-100",
  },
];

export default function DataSource() {
  const [sources, setSources] = useState(initialDataSources);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState("HRIS");

  const loadSources = async () => {
    try {
      const remote = await api.get<any[]>("/api/data-sources");
      setSources(
        remote.map((item) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          syncTime: item.lastSyncAt
            ? new Date(item.lastSyncAt).toLocaleString()
            : "Never",
          successRate: `${Number(item.successRate || 0).toFixed(1)}%`,
          iconUrl:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqyHpz5lkNujBsw9OX9c0_PcTihdDLVIzBled8f1K9cV0rqfJoXWEG1JAD30ejzP-pQ7AqXe-6KoM3sS4E5gzYv1YgvEB8vE3cSMa9gni_N_L14Wmzz6RWtKJehccUNzqAnm6xJlB0uU8cFzFzXaQdGFaKWz3E1IWasbZpjBqX7JPQ8qGYQLtsrTzWzqwHUXd1d40YvG2h81Row-kpfEOWjoB72MyclEeP3irnzVdryxDBKanv_YyV_opuKhisZU1O4Jx5L-U03hxH')",
          colorClass: "bg-slate-50 border-slate-200",
        })),
      );
      setError("");
    } catch (e: any) {
      setError(e.message || "加载数据源失败");
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleReconnect = async (id: number | string) => {
    try {
      await api.post(`/api/data-sources/${id}/sync`);
      await loadSources();
    } catch (e: any) {
      setError(e.message || "重连失败");
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/data-sources", {
        name: newSourceName,
        type: newSourceType,
        syncMode: "API",
      });
      setIsAddModalOpen(false);
      setNewSourceName("");
      await loadSources();
    } catch (e: any) {
      setError(e.message || "新增数据源失败");
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch("/api/data-sources", {
        id: editingSource.id,
        name: editingSource.name,
      });
      setEditingSource(null);
      await loadSources();
    } catch (e: any) {
      setError(e.message || "保存配置失败");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            数据源管理
          </h1>
          <p className="text-slate-500">
            连接并监控企业 HR 数据管道及系统健康状况。
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={18} /> 添加新数据源
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold">
          全部系统
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-semibold">
          HRIS
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-semibold">
          招聘
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-semibold">
          绩效
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-semibold">
          考勤
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`size-12 rounded-lg flex items-center justify-center border overflow-hidden ${source.colorClass}`}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: source.iconUrl,
                  }}
                ></div>
              </div>
              {source.status === "connected" ? (
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
                  已连接
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">
                  已断开
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{source.name}</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">上次同步</span>
                <span
                  className={`font-medium ${
                    source.status === "disconnected" ? "text-red-500" : ""
                  }`}
                >
                  {source.syncTime}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">成功率</span>
                <span
                  className={`${
                    source.status === "disconnected"
                      ? "text-red-600"
                      : "text-green-600"
                  } font-bold`}
                >
                  {source.successRate}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-2">
                <div
                  className={`${
                    source.status === "disconnected"
                      ? "bg-red-500"
                      : "bg-green-500"
                  } h-1 rounded-full`}
                  style={{ width: source.successRate }}
                ></div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 mt-auto border-t border-slate-50">
              {source.status === "disconnected" ? (
                <button
                  onClick={() => handleReconnect(source.id)}
                  className="flex-1 py-2 text-[11px] font-bold bg-primary text-white hover:bg-primary/90 rounded transition-colors uppercase tracking-tight shadow-sm"
                >
                  重新连接
                </button>
              ) : (
                <button
                  onClick={() => setEditingSource(source)}
                  className="flex-1 py-2 text-[11px] font-bold bg-slate-50 hover:bg-slate-100 rounded transition-colors uppercase tracking-tight"
                >
                  编辑配置
                </button>
              )}
              <button
                onClick={() => setEditingSource(source)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded transition-colors"
              >
                <Settings size={18} />
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded transition-colors">
                <FileText size={18} />
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={() => setIsAddModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Plus
              className="text-slate-400 group-hover:text-primary transition-colors"
              size={24}
            />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">连接新系统</h3>
          <p className="text-xs text-slate-500 px-4">
            将更多 HR 数据源集成到您的生态系统中。
          </p>
        </div>
      </div>

      <div className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Activity size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">全局同步健康度</h4>
            <p className="text-sm text-slate-500">
              所有活动连接的平均系统成功率。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-black text-primary">99.6%</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Overall Success
            </div>
          </div>
          <div className="h-10 w-px bg-primary/20 hidden md:block"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900">
              {sources.filter((s) => s.status === "connected").length} /{" "}
              {sources.length}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Active Links
            </div>
          </div>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2 rounded-lg text-sm font-bold transition-all">
            下载报告
          </button>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">添加新数据源</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  系统名称
                </label>
                <input
                  required
                  type="text"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="例如: BambooHR"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  系统类型
                </label>
                <select
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>HRIS</option>
                  <option>Recruiting</option>
                  <option>Performance</option>
                  <option>Attendance</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                >
                  连接系统
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingSource && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">
                编辑配置 - {editingSource.name}
              </h3>
              <button
                onClick={() => setEditingSource(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  系统名称
                </label>
                <input
                  required
                  type="text"
                  value={editingSource.name}
                  onChange={(e) =>
                    setEditingSource({ ...editingSource, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  同步频率
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                  <option>实时 (Real-time)</option>
                  <option>每小时 (Hourly)</option>
                  <option>每天 (Daily)</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSource(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                >
                  保存配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
