import React, { useEffect, useState } from "react";
import { ShieldCheck, UserCog, ScrollText } from "lucide-react";
import { api } from "../lib/api";

export default function PermissionManagement() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [form, setForm] = useState({ userId: "", roleId: "" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const [roleList, permList, userRoleList, logs] = await Promise.all([
        api.get<any[]>("/api/roles"),
        api.get<any[]>("/api/permissions"),
        api.get<any[]>("/api/user-roles"),
        api.get<any[]>("/api/audit-logs"),
      ]);
      setRoles(roleList);
      setPermissions(permList);
      setUserRoles(userRoleList);
      setAuditLogs(logs);
    } catch (e: any) {
      setError(e.message || "加载权限数据失败");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/user-roles", form);
      setForm({ userId: "", roleId: "" });
      await load();
    } catch (e: any) {
      setError(e.message || "角色分配失败");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">权限管理</h1>
        <p className="text-slate-500 mt-1">基于 RBAC 的角色权限和访问审计。</p>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <ShieldCheck size={18} />
            角色与权限
          </h2>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                <p className="font-semibold text-sm">{role.role_name}</p>
                <p className="text-xs text-slate-500 mt-1">{role.role_code}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(role.role_permissions || []).map((rp: any) => (
                    <span key={rp.permission_id} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {rp.permissions?.perm_code}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <UserCog size={18} />
            绑定用户角色
          </h2>
          <form onSubmit={assignRole} className="space-y-3">
            <input
              placeholder="Supabase User ID"
              value={form.userId}
              onChange={(e) => setForm((prev) => ({ ...prev, userId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
            <select
              value={form.roleId}
              onChange={(e) => setForm((prev) => ({ ...prev, roleId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            >
              <option value="">请选择角色</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.role_name}
                </option>
              ))}
            </select>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
              提交绑定
            </button>
          </form>

          <div className="mt-4 space-y-2 max-h-52 overflow-auto">
            {userRoles.map((ur) => (
              <div key={ur.id} className="text-xs p-2 bg-slate-50 rounded border border-slate-100">
                {ur.profiles?.email || ur.user_id} {"->"}{" "}
                {ur.roles?.role_name || ur.role_id}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold flex items-center gap-2 mb-4">
          <ScrollText size={18} />
          审计日志
        </h2>
        <div className="space-y-2 max-h-80 overflow-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="grid grid-cols-12 text-sm p-3 rounded border border-slate-100">
              <span className="col-span-3">{log.action}</span>
              <span className="col-span-2">{log.resource}</span>
              <span className="col-span-2">{log.success ? "成功" : "失败"}</span>
              <span className="col-span-5 text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold mb-3">权限字典</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {permissions.map((p) => (
            <div key={p.id} className="p-2 border border-slate-100 rounded text-sm">
              <span className="font-mono text-xs text-primary">{p.perm_code}</span> - {p.perm_name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
