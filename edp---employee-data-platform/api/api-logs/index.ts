import { ApiReq, ApiRes, getAuthContext, requirePermission, sendError, sendMethodNotAllowed, sendOk } from "../_lib/http";
import { supabaseAdmin } from "../_lib/supabase";

export default async function handler(req: ApiReq, res: ApiRes) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);

  const auth = await getAuthContext(req);
  const canRead = await requirePermission(auth.userId, "api.read");
  if (!canRead) return sendError(res, 403, "Missing permission: api.read");

  const { data, error } = await supabaseAdmin
    .from("api_call_logs")
    .select("id, endpoint, status_code, latency_ms, request_id, created_at, api_clients:api_client_id(client_name)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return sendError(res, 500, "Failed to load API logs", error.message);
  return sendOk(res, data || []);
}
