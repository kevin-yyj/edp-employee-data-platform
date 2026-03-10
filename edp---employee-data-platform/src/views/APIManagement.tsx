import React, { useEffect, useState } from "react";
import { KeyRound, FileCode2, Activity } from "lucide-react";
import { api } from "../lib/api";

export default function APIManagement() {
  const [apis, setApis] = useState<any[]>([]);
  const [keys, setKeys] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [newKey, setNewKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [apiList, keyList, logList] = await Promise.all([
        api.get<any[]>("/api/apis"),
        api.get<any[]>("/api/api-keys"),
        api.get<any[]>("/api/api-logs"),
      ]);
      setApis(apiList);
      setKeys(keyList);
      setLogs(logList);
    } catch (e: any) {
      setError(e.message || "加载 API 管理数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateKey = async () => {
    try {
      const created = await api.post<any>("/api/api-keys", {
        clientName: `EDP-Client-${new Date().toISOString().slice(0, 10)}`,
      });
      setNewKey(created.plainKey || "");
      await load();
    } catch (e: any) {
      setError(e.message || "创建 API Key 失败");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">API 管理</h1>
        <p className="text-slate-500 mt-1">查看接口目录、管理 API Key、监控调用日志。</p>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}

      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <KeyRound size={18} />
            API Key
          </h2>
          <button
            onClick={handleCreateKey}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
          >
            生成新 Key
          </button>
        </div>
        {newKey && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
            新 Key（仅展示一次）：<span className="font-mono">{newKey}</span>
          </div>
        )}
        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between p-3 rounded border border-slate-100 bg-slate-50">
              <div>
                <p className="font-medium text-sm">{k.client_name}</p>
                <p className="text-xs text-slate-500">{k.status}</p>
              </div>
              <p className="text-xs text-slate-400">{new Date(k.created_at).toLocaleString()}</p>
            </div>
          ))}
          {!loading && keys.length === 0 && <p className="text-sm text-slate-500">暂无 API Key</p>}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold flex items-center gap-2 mb-4">
          <FileCode2 size={18} />
          接口目录
        </h2>
        <div className="space-y-2">
          {apis.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 text-sm p-3 rounded border border-slate-100">
              <span className="col-span-2 font-semibold text-primary">{item.method}</span>
              <span className="col-span-4 font-mono text-xs">{item.path}</span>
              <span className="col-span-3">{item.name}</span>
              <span className="col-span-3 text-slate-500">{item.permission}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold flex items-center gap-2 mb-4">
          <Activity size={18} />
          调用日志
        </h2>
        <div className="space-y-2 max-h-96 overflow-auto">
          {logs.map((log) => (
            <div key={log.id} className="grid grid-cols-12 text-sm p-3 rounded border border-slate-100">
              <span className="col-span-4 font-mono text-xs">{log.endpoint}</span>
              <span className="col-span-2">{log.status_code}</span>
              <span className="col-span-2">{log.latency_ms} ms</span>
              <span className="col-span-4 text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
            </div>
          ))}
          {!loading && logs.length === 0 && <p className="text-sm text-slate-500">暂无调用日志</p>}
        </div>
      </section>
    </div>
  );
}
