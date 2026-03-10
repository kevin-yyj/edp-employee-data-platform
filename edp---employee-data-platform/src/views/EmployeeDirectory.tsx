import React, { useState } from "react";
import {
  Search,
  Upload,
  Download,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface EmployeeDirectoryProps {
  employees: any[];
  onSelectEmployee: (id: string) => void;
  onAddEmployee: (emp: any) => void;
}

export default function EmployeeDirectory({
  employees,
  onSelectEmployee,
  onAddEmployee,
}: EmployeeDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("全部部门");
  const [country, setCountry] = useState("全部国家");
  const [status, setStatus] = useState("在职状态");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: "",
    id: "",
    department: "Engineering",
    country: "United States",
    role: "",
    joinDate: "",
    status: "Onboarded",
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchQuery =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.employeeCode || emp.id)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchDept =
      department === "全部部门" || emp.department === department;
    const matchCountry = country === "全部国家" || emp.country === country;
    const matchStatus = status === "在职状态" || emp.status === status;
    return matchQuery && matchDept && matchCountry && matchStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEmployee({
      ...newEmp,
      id: newEmp.id || crypto.randomUUID(),
      employeeCode: newEmp.id || `EMP-${Math.floor(Math.random() * 10000)}`,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDtuNG4fx78h3qKCpXBD2lKSBpg8_7LP9gs3o0tfPbpqmiDrTzhEF3SruyB-Ch0mJCWlhTzYkH-ws90Fkb_fiKAyiT0SkyMQ0c4xrOTOAv3uLIm4cme2KYYmmZBND8BLz8oRXAgkUcqv_VgzI-vlmb1eTT4MJDTcIG-eghOGP7Wfh5yedBUAR_3e1zNIRkHhPKXgugg4z790qEM_xrK4h0Mypbhkez03szmLRZ4tGtcMQCCM_v3rA_f4TAU0LDTb_wr-4JRWqyjN4HH",
    });
    setIsAddModalOpen(false);
    setNewEmp({
      name: "",
      id: "",
      department: "Engineering",
      country: "United States",
      role: "",
      joinDate: "",
      status: "Onboarded",
    });
  };
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">员工档案</h1>
          <p className="text-slate-500">全球运营的统一组织员工名录。</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Upload size={18} /> 导入
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Download size={18} /> 导出
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <UserPlus size={18} /> 添加员工
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative md:col-span-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="搜索姓名或 ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option>全部部门</option>
          <option>Engineering</option>
          <option>Product</option>
          <option>Human Resources</option>
          <option>Sales</option>
          <option>Marketing</option>
          <option>Finance</option>
        </select>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option>全部国家</option>
          <option>United States</option>
          <option>Germany</option>
          <option>Singapore</option>
          <option>United Kingdom</option>
          <option>Canada</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option>在职状态</option>
          <option>Onboarded</option>
          <option>Resigned</option>
          <option>On Leave</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                员工 ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                姓名
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                国家
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                部门
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                职位
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                入职日期
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td
                  className="px-6 py-4 text-sm font-medium text-primary cursor-pointer hover:underline"
                  onClick={() => onSelectEmployee(emp.id)}
                >
                  {emp.employeeCode || emp.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="size-8 rounded-full bg-slate-200 object-cover"
                    />
                    <span className="text-sm font-semibold">{emp.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {emp.country}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {emp.department}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{emp.role}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {emp.joinDate}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      emp.status === "Onboarded"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  未找到匹配的员工记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            显示第 <span className="font-semibold">1</span> 到{" "}
            <span className="font-semibold">10</span> 条，共{" "}
            <span className="font-semibold">1,284</span> 条结果
          </p>
          <div className="flex items-center gap-2">
            <button
              className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50"
              disabled
            >
              <ChevronLeft size={20} />
            </button>
            <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              1
            </button>
            <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white font-bold text-sm">
              2
            </button>
            <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white font-bold text-sm">
              3
            </button>
            <span className="px-1">...</span>
            <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white font-bold text-sm">
              129
            </button>
            <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">添加新员工</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  姓名
                </label>
                <input
                  required
                  type="text"
                  value={newEmp.name}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    员工 ID (选填)
                  </label>
                  <input
                    type="text"
                    value={newEmp.id}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, id: e.target.value })
                    }
                    placeholder="自动生成"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    入职日期
                  </label>
                  <input
                    required
                    type="date"
                    value={newEmp.joinDate}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, joinDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    部门
                  </label>
                  <select
                    value={newEmp.department}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    职位
                  </label>
                  <input
                    required
                    type="text"
                    value={newEmp.role}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  国家
                </label>
                <select
                  value={newEmp.country}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>United States</option>
                  <option>Germany</option>
                  <option>Singapore</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
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
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
