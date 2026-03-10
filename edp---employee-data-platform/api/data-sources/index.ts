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

function mapDataSource(row: any) {
  return {
    id: row.id,
    name: row.source_name,
    type: row.source_type,
    syncMode: row.sync_mode,
    status: row.status,
    successRate: Number(row.success_rate || 0),
    lastSyncAt: row.last_sync_at,
    createdAt: row.created_at,
  };
}

export default async function handler(req: ApiReq, res: ApiRes) {
  const auth = await getAuthContext(req);

  if (req.method === "GET") {
    const canRead = await requirePermission(auth.userId, "datasource.read");
    if (!canRead) return sendError(res, 403, "Missing permission: datasource.read");

    const { data, error } = await supabaseAdmin
      .from("data_sources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return sendError(res, 500, "Failed to load data sources", error.message);
    return sendOk(res, (data || []).map(mapDataSource));
  }

  if (req.method === "POST") {
    const canWrite = await requirePermission(auth.userId, "datasource.write");
    if (!canWrite) return sendError(res, 403, "Missing permission: datasource.write");

    const body = req.body || {};
    if (!body.name || !body.type) return sendError(res, 400, "name and type are required");

    const { data, error } = await supabaseAdmin
      .from("data_sources")
      .insert({
        source_name: body.name,
        source_type: body.type,
        sync_mode: body.syncMode || "API",
        status: body.status || "connected",
        success_rate: body.successRate ?? 100,
        last_sync_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      await writeAuditLog({
        userId: auth.userId,
        action: "datasource.create",
        resource: "data_sources",
        success: false,
        meta: { reason: error.message },
      });
      return sendError(res, 500, "Failed to create data source", error.message);
    }

    await writeAuditLog({
      userId: auth.userId,
      action: "datasource.create",
      resource: "data_sources",
      success: true,
      meta: { dataSourceId: data.id },
    });

    return sendOk(res, mapDataSource(data));
  }

  if (req.method === "PATCH") {
    const canWrite = await requirePermission(auth.userId, "datasource.write");
    if (!canWrite) return sendError(res, 403, "Missing permission: datasource.write");

    const body = req.body || {};
    if (!body.id) return sendError(res, 400, "id is required");

    const updatePayload: Record<string, unknown> = {};
    if (body.name !== undefined) updatePayload.source_name = body.name;
    if (body.type !== undefined) updatePayload.source_type = body.type;
    if (body.syncMode !== undefined) updatePayload.sync_mode = body.syncMode;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.successRate !== undefined) updatePayload.success_rate = body.successRate;
    if (body.lastSyncAt !== undefined) updatePayload.last_sync_at = body.lastSyncAt;

    const { data, error } = await supabaseAdmin
      .from("data_sources")
      .update(updatePayload)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) return sendError(res, 500, "Failed to update data source", error.message);
    return sendOk(res, mapDataSource(data));
  }

  return sendMethodNotAllowed(res, ["GET", "POST", "PATCH"]);
}
