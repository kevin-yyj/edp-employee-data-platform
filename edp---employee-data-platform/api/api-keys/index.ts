import { createHash, randomBytes } from "crypto";
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

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export default async function handler(req: ApiReq, res: ApiRes) {
  const auth = await getAuthContext(req);

  if (req.method === "GET") {
    const canRead = await requirePermission(auth.userId, "api.read");
    if (!canRead) return sendError(res, 403, "Missing permission: api.read");

    const { data, error } = await supabaseAdmin
      .from("api_clients")
      .select("id, client_name, status, created_at")
      .order("created_at", { ascending: false });

    if (error) return sendError(res, 500, "Failed to list API keys", error.message);
    return sendOk(res, data || []);
  }

  if (req.method === "POST") {
    const canWrite = await requirePermission(auth.userId, "api.write");
    if (!canWrite) return sendError(res, 403, "Missing permission: api.write");

    const body = req.body || {};
    const clientName = body.clientName || "EDP Client";
    const plain = `edp_${randomBytes(24).toString("hex")}`;
    const hash = hashToken(plain);

    const { data, error } = await supabaseAdmin
      .from("api_clients")
      .insert({
        client_name: clientName,
        api_key_hash: hash,
        status: "active",
        created_by: auth.userId,
      })
      .select("id, client_name, status, created_at")
      .single();

    if (error) return sendError(res, 500, "Failed to create API key", error.message);

    await writeAuditLog({
      userId: auth.userId,
      action: "api_keys.create",
      resource: "api_clients",
      success: true,
      meta: { clientId: data.id },
    });

    return sendOk(res, {
      ...data,
      plainKey: plain,
      hint: "This key is only shown once.",
    });
  }

  return sendMethodNotAllowed(res, ["GET", "POST"]);
}
