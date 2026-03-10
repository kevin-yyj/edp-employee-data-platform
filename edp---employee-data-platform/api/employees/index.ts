import { ApiReq, ApiRes, getAuthContext, requirePermission, sendError, sendMethodNotAllowed, sendOk, writeAuditLog } from "../_lib/http";
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

  if (req.method === "GET") {
    const canRead = await requirePermission(auth.userId, "employee.read");
    if (!canRead) return sendError(res, 403, "Missing permission: employee.read");

    const query = req.query.q;
    let sql = supabaseAdmin
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (query) {
      sql = sql.or(`full_name.ilike.%${query}%,employee_code.ilike.%${query}%`);
    }

    const { data, error } = await sql.limit(300);
    if (error) return sendError(res, 500, "Failed to fetch employees", error.message);

    await writeAuditLog({
      userId: auth.userId,
      action: "employees.list",
      resource: "employees",
      success: true,
      meta: { count: data?.length || 0 },
    });

    return sendOk(res, (data || []).map(mapEmployee));
  }

  if (req.method === "POST") {
    const canWrite = await requirePermission(auth.userId, "employee.write");
    if (!canWrite) return sendError(res, 403, "Missing permission: employee.write");

    const body = req.body || {};
    if (!body.name || !body.country || !body.department || !body.role || !body.joinDate) {
      return sendError(res, 400, "Missing required fields");
    }

    const employeeCode = body.employeeCode || `EMP-${Date.now()}`;
    const payload = {
      employee_code: employeeCode,
      full_name: body.name,
      email: body.email || null,
      country: body.country,
      department: body.department,
      role_title: body.role,
      hire_date: body.joinDate,
      status: body.status || "Onboarded",
      avatar_url: body.avatar || null,
    };

    const { data, error } = await supabaseAdmin
      .from("employees")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      await writeAuditLog({
        userId: auth.userId,
        action: "employees.create",
        resource: "employees",
        success: false,
        meta: { reason: error.message },
      });
      return sendError(res, 500, "Failed to create employee", error.message);
    }

    await writeAuditLog({
      userId: auth.userId,
      action: "employees.create",
      resource: "employees",
      success: true,
      meta: { employeeId: data.id },
    });

    return sendOk(res, mapEmployee(data));
  }

  return sendMethodNotAllowed(res, ["GET", "POST"]);
}
