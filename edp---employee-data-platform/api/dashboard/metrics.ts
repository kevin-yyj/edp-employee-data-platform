import { ApiReq, ApiRes, getAuthContext, requirePermission, sendError, sendMethodNotAllowed, sendOk } from "../_lib/http";
import { supabaseAdmin } from "../_lib/supabase";

export default async function handler(req: ApiReq, res: ApiRes) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);

  const auth = await getAuthContext(req);
  const canRead = await requirePermission(auth.userId, "employee.read");
  if (!canRead) return sendError(res, 403, "Missing permission: employee.read");

  const [{ count: totalEmployees }, { count: activeEmployees }, { data: sources }, { data: jobs }] =
    await Promise.all([
      supabaseAdmin.from("employees").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("employees")
        .select("*", { count: "exact", head: true })
        .neq("status", "Resigned"),
      supabaseAdmin.from("data_sources").select("id, status, success_rate"),
      supabaseAdmin
        .from("sync_jobs")
        .select("id, status, records_synced, duration_seconds, created_at, data_sources: data_source_id(source_name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const turnoverRate =
    totalEmployees && totalEmployees > 0
      ? Number((((totalEmployees - (activeEmployees || 0)) / totalEmployees) * 100).toFixed(1))
      : 0;

  const connectedSources = (sources || []).filter((s: any) => s.status === "connected").length;
  const avgSourceSuccessRate =
    (sources || []).length > 0
      ? Number(
          (
            (sources || []).reduce((sum: number, curr: any) => sum + Number(curr.success_rate || 0), 0) /
            (sources || []).length
          ).toFixed(1),
        )
      : 0;

  return sendOk(res, {
    totalEmployees: totalEmployees || 0,
    turnoverRate,
    connectedSources,
    totalSources: (sources || []).length,
    avgSourceSuccessRate,
    recentJobs:
      (jobs || []).map((job: any) => ({
        id: job.id,
        sourceName: job.data_sources?.source_name || "Unknown",
        recordsSynced: job.records_synced,
        durationSeconds: job.duration_seconds,
        status: job.status,
        createdAt: job.created_at,
      })) || [],
  });
}
