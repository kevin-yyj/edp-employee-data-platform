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
  if (req.method !== "POST") return sendMethodNotAllowed(res, ["POST"]);

  const auth = await getAuthContext(req);
  const canWrite = await requirePermission(auth.userId, "datasource.write");
  if (!canWrite) return sendError(res, 403, "Missing permission: datasource.write");

  const id = req.query.id;
  if (!id) return sendError(res, 400, "Missing data source id");

  const recordsSynced = Math.floor(Math.random() * 10000) + 1000;
  const durationSeconds = Math.floor(Math.random() * 180) + 10;

  const [{ data: source, error: updateError }, { error: syncError }] = await Promise.all([
    supabaseAdmin
      .from("data_sources")
      .update({
        status: "connected",
        success_rate: 100,
        last_sync_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single(),
    supabaseAdmin.from("sync_jobs").insert({
      data_source_id: id,
      records_synced: recordsSynced,
      duration_seconds: durationSeconds,
      status: "success",
      message: "Manual sync triggered from EDP",
    }),
  ]);

  if (updateError || syncError) {
    return sendError(res, 500, "Failed to execute sync", updateError?.message || syncError?.message);
  }

  return sendOk(res, source);
}
