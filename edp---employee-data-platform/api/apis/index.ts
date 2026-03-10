import { ApiReq, ApiRes, getAuthContext, requirePermission, sendError, sendMethodNotAllowed, sendOk } from "../_lib/http";

const apiCatalog = [
  { name: "获取员工信息", method: "GET", path: "/api/employees/:id", permission: "employee.read" },
  { name: "获取员工列表", method: "GET", path: "/api/employees", permission: "employee.read" },
  { name: "员工360画像", method: "GET", path: "/api/employees/:id/profile", permission: "employee.read" },
  { name: "数据源列表", method: "GET", path: "/api/data-sources", permission: "datasource.read" },
  { name: "权限列表", method: "GET", path: "/api/permissions", permission: "rbac.read" },
  { name: "角色列表", method: "GET", path: "/api/roles", permission: "rbac.read" },
];

export default async function handler(req: ApiReq, res: ApiRes) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);

  const auth = await getAuthContext(req);
  const canRead = await requirePermission(auth.userId, "api.read");
  if (!canRead) return sendError(res, 403, "Missing permission: api.read");

  return sendOk(res, apiCatalog);
}
