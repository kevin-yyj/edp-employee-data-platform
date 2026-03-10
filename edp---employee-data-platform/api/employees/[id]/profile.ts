import {
  ApiReq,
  ApiRes,
  getAuthContext,
  requirePermission,
  sendError,
  sendMethodNotAllowed,
  sendOk,
} from "../../_lib/http";
import { supabaseAdmin } from "../../_lib/supabase";

export default async function handler(req: ApiReq, res: ApiRes) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);

  const auth = await getAuthContext(req);
  const canRead = await requirePermission(auth.userId, "employee.read");
  if (!canRead) return sendError(res, 403, "Missing permission: employee.read");

  const id = req.query.id;
  if (!id) return sendError(res, 400, "Missing employee id");

  const { data: employee, error: empError } = await supabaseAdmin
    .from("employees")
    .select("id, employee_code, full_name, country, department, role_title, hire_date, status, avatar_url")
    .or(`id.eq.${id},employee_code.eq.${id}`)
    .single();

  if (empError || !employee) return sendError(res, 404, "Employee not found");

  const [{ data: performance }, { data: attendance }] = await Promise.all([
    supabaseAdmin
      .from("performance_records")
      .select("review_period, score")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: true }),
    supabaseAdmin
      .from("attendance_records")
      .select("work_date, attendance_status")
      .eq("employee_id", employee.id)
      .order("work_date", { ascending: false })
      .limit(30),
  ]);

  return sendOk(res, {
    employee: {
      id: employee.id,
      employeeCode: employee.employee_code,
      name: employee.full_name,
      country: employee.country,
      department: employee.department,
      role: employee.role_title,
      joinDate: employee.hire_date,
      status: employee.status,
      avatar: employee.avatar_url,
    },
    performance: performance || [],
    attendance: attendance || [],
  });
}
