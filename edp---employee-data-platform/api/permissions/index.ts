import { ApiReq, ApiRes, getAuthContext, requirePermission, sendError, sendMethodNotAllowed, sendOk } from "../_lib/http";
import { supabaseAdmin } from "../_lib/supabase";

export default async function handler(req: ApiReq, res: ApiRes) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);

  const auth = await getAuthContext(req);
  const canRead = await requirePermission(auth.userId, "rbac.read");
  if (!canRead) return sendError(res, 403, "Missing permission: rbac.read");

  const { data, error } = await supabaseAdmin
    .from("permissions")
    .select("id, perm_code, perm_name")
    .order("perm_code", { ascending: true });

  if (error) return sendError(res, 500, "Failed to load permissions", error.message);
  return sendOk(res, data || []);
}
