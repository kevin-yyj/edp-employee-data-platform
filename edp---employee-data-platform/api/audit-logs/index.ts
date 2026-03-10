import { ApiReq, ApiRes, getAuthContext, requirePermission, sendError, sendMethodNotAllowed, sendOk } from "../_lib/http";
import { supabaseAdmin } from "../_lib/supabase";

export default async function handler(req: ApiReq, res: ApiRes) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);

  const auth = await getAuthContext(req);
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
