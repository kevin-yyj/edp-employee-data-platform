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

export default async function handler(req: ApiReq, res: ApiRes) {
  const auth = await getAuthContext(req);

  if (req.method === "GET") {
    const canRead = await requirePermission(auth.userId, "rbac.read");
    if (!canRead) return sendError(res, 403, "Missing permission: rbac.read");

    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("id, user_id, role_id, roles:role_id(role_code, role_name), profiles:user_id(display_name, email)")
      .order("id", { ascending: false });

    if (error) return sendError(res, 500, "Failed to load user-role mappings", error.message);
    return sendOk(res, data || []);
  }

  if (req.method === "POST") {
    const canWrite = await requirePermission(auth.userId, "rbac.write");
    if (!canWrite) return sendError(res, 403, "Missing permission: rbac.write");

    const body = req.body || {};
    if (!body.userId || !body.roleId) {
      return sendError(res, 400, "userId and roleId are required");
    }

    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: body.userId, role_id: body.roleId })
      .select("*")
      .single();

    if (error) return sendError(res, 500, "Failed to assign role", error.message);

    await writeAuditLog({
      userId: auth.userId,
      action: "rbac.assign_role",
      resource: "user_roles",
      success: true,
      meta: { targetUserId: body.userId, roleId: body.roleId },
    });

    return sendOk(res, data);
  }

  return sendMethodNotAllowed(res, ["GET", "POST"]);
}
