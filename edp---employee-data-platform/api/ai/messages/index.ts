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
    if (!auth.userId) return sendError(res, 401, "Missing authentication token");

    const sessionId = req.query.sessionId;
    if (!sessionId) return sendError(res, 400, "sessionId is required");

    const canReadAll = await requirePermission(auth.userId, "ai.read");
    if (!canReadAll) {
      const { data: session } = await supabaseAdmin
        .from("ai_sessions")
        .select("id, user_id")
        .eq("id", sessionId)
        .single();
      if (!session || session.user_id !== auth.userId) {
        return sendError(res, 403, "Unauthorized session access");
      }
    }

    const { data, error } = await supabaseAdmin
      .from("ai_messages")
      .select("id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) return sendError(res, 500, "Failed to load messages", error.message);
    return sendOk(res, data || []);
  }

  if (req.method === "POST") {
    if (!auth.userId) return sendError(res, 401, "Missing authentication token");

    const body = req.body || {};
    if (!body.sessionId || !body.role || !body.content) {
      return sendError(res, 400, "sessionId, role and content are required");
    }

    const canWriteAll = await requirePermission(auth.userId, "ai.write");
    if (!canWriteAll) {
      const { data: session } = await supabaseAdmin
        .from("ai_sessions")
        .select("id, user_id")
        .eq("id", body.sessionId)
        .single();
      if (!session || session.user_id !== auth.userId) {
        return sendError(res, 403, "Unauthorized session access");
      }
    }

    const { data, error } = await supabaseAdmin
      .from("ai_messages")
      .insert({
        session_id: body.sessionId,
        role: body.role,
        content: body.content,
      })
      .select("*")
      .single();

    if (error) return sendError(res, 500, "Failed to save message", error.message);

    await supabaseAdmin
      .from("ai_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", body.sessionId);

    return sendOk(res, data);
  }

  return sendMethodNotAllowed(res, ["GET", "POST"]);
}
