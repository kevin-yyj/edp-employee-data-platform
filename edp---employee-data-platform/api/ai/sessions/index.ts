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
  const auth = await getAuthContext(req);

  if (req.method === "GET") {
    const canReadOwn = auth.userId !== null;
    const canReadAll = await requirePermission(auth.userId, "ai.read");
    if (!canReadOwn && !canReadAll) return sendError(res, 403, "Unauthorized");

    let query = supabaseAdmin
      .from("ai_sessions")
      .select("id, user_id, title, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (!canReadAll && auth.userId) query = query.eq("user_id", auth.userId);

    const { data, error } = await query;
    if (error) return sendError(res, 500, "Failed to list sessions", error.message);
    return sendOk(res, data || []);
  }

  if (req.method === "POST") {
    if (!auth.userId) return sendError(res, 401, "Missing authentication token");

    const body = req.body || {};
    const { data, error } = await supabaseAdmin
      .from("ai_sessions")
      .insert({
        user_id: auth.userId,
        title: body.title || "EDP AI 会话",
      })
      .select("*")
      .single();

    if (error) return sendError(res, 500, "Failed to create session", error.message);
    return sendOk(res, data);
  }

  return sendMethodNotAllowed(res, ["GET", "POST"]);
}
