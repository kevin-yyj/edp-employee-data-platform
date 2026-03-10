import {
  ApiReq,
  ApiRes,
  getAuthContext,
  requirePermission,
  sendError,
  sendMethodNotAllowed,
  sendOk,
  writeAuditLog,
} from "./_lib/http";
import { supabaseAdmin } from "./_lib/supabase";

export default async function handler(req: ApiReq, res: ApiRes) {
  const auth = await getAuthContext(req);
  const resource = req.query.resource;

  if (resource === "roles") {
    if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);
    const canRead = await requirePermission(auth.userId, "rbac.read");
    if (!canRead) return sendError(res, 403, "Missing permission: rbac.read");

    const { data, error } = await supabaseAdmin
      .from("roles")
      .select(
        "id, role_code, role_name, role_permissions:role_permissions(permission_id, permissions:permission_id(perm_code, perm_name))",
      )
      .order("role_code", { ascending: true });

    if (error) return sendError(res, 500, "Failed to load roles", error.message);
    return sendOk(res, data || []);
  }

  if (resource === "permissions") {
    if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);
    const canRead = await requirePermission(auth.userId, "rbac.read");
    if (!canRead) return sendError(res, 403, "Missing permission: rbac.read");

    const { data, error } = await supabaseAdmin
      .from("permissions")
      .select("id, perm_code, perm_name")
      .order("perm_code", { ascending: true });

    if (error) return sendError(res, 500, "Failed to load permissions", error.message);
    return sendOk(res, data || []);
  }

  if (resource === "user-roles") {
    if (req.method === "GET") {
      const canRead = await requirePermission(auth.userId, "rbac.read");
      if (!canRead) return sendError(res, 403, "Missing permission: rbac.read");

      const { data, error } = await supabaseAdmin
        .from("user_roles")
        .select(
          "id, user_id, role_id, roles:role_id(role_code, role_name), profiles:user_id(display_name, email)",
        )
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

  if (resource === "audit-logs") {
    if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);
    const canRead = await requirePermission(auth.userId, "audit.read");
    if (!canRead) return sendError(res, 403, "Missing permission: audit.read");

    const { data, error } = await supabaseAdmin
      .from("access_audit_logs")
      .select("id, user_id, action, resource, success, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return sendError(res, 500, "Failed to fetch audit logs", error.message);
    return sendOk(res, data || []);
  }

  return sendError(res, 400, "Invalid resource for /api/admin");
}
