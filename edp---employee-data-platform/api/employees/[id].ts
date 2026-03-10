import {
  ApiReq,
  ApiRes,
  getAuthContext,
  requirePermission,
  sendError,
  sendMethodNotAllowed,
  sendOk,
  writeAuditLog,
} from "../_lib/http";
import { supabaseAdmin } from "../_lib/supabase";

function mapEmployee(row: any) {
  return {
    id: row.id,
    employeeCode: row.employee_code,
    name: row.full_name,
    email: row.email,
    country: row.country,
    department: row.department,
    role: row.role_title,
    joinDate: row.hire_date,
    status: row.status,
    avatar: row.avatar_url,
  };
}

export default async function handler(req: ApiReq, res: ApiRes) {
  const auth = await getAuthContext(req);
  const id = req.query.id;
  if (!id) return sendError(res, 400, "Missing employee id");

  if (req.method === "GET") {
    const canRead = await requirePermission(auth.userId, "employee.read");
    if (!canRead) return sendError(res, 403, "Missing permission: employee.read");

    const { data, error } = await supabaseAdmin
      .from("employees")
      .select("*")
      .or(`id.eq.${id},employee_code.eq.${id}`)
      .single();

    if (error || !data) return sendError(res, 404, "Employee not found");
    return sendOk(res, mapEmployee(data));
  }

  if (req.method === "PATCH") {
    const canWrite = await requirePermission(auth.userId, "employee.write");
    if (!canWrite) return sendError(res, 403, "Missing permission: employee.write");

    const body = req.body || {};
    const updatePayload: Record<string, unknown> = {};
    if (body.name !== undefined) updatePayload.full_name = body.name;
    if (body.email !== undefined) updatePayload.email = body.email;
    if (body.country !== undefined) updatePayload.country = body.country;
    if (body.department !== undefined) updatePayload.department = body.department;
    if (body.role !== undefined) updatePayload.role_title = body.role;
    if (body.joinDate !== undefined) updatePayload.hire_date = body.joinDate;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.avatar !== undefined) updatePayload.avatar_url = body.avatar;

    const { data, error } = await supabaseAdmin
      .from("employees")
      .update(updatePayload)
      .or(`id.eq.${id},employee_code.eq.${id}`)
      .select("*")
      .single();

    if (error || !data) {
      await writeAuditLog({
        userId: auth.userId,
        action: "employees.update",
        resource: "employees",
        success: false,
        meta: { employeeId: id, reason: error?.message },
      });
      return sendError(res, 500, "Failed to update employee", error?.message);
    }

    await writeAuditLog({
      userId: auth.userId,
      action: "employees.update",
      resource: "employees",
      success: true,
      meta: { employeeId: data.id },
    });

    return sendOk(res, mapEmployee(data));
  }

  return sendMethodNotAllowed(res, ["GET", "PATCH"]);
}
