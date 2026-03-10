import { supabaseAdmin } from "./supabase";

export type ApiReq = {
  method?: string;
  headers: Record<string, string | undefined>;
  query: Record<string, string | undefined>;
  body?: any;
};

export type ApiRes = {
  status: (code: number) => ApiRes;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export type AuthContext = {
  userId: string | null;
  userEmail: string | null;
  isService: boolean;
};

function getToken(req: ApiReq): string | null {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  const [prefix, token] = authHeader.split(" ");
  if (!prefix || !token || prefix.toLowerCase() !== "bearer") return null;
  return token;
}

export async function getAuthContext(req: ApiReq): Promise<AuthContext> {
  const token = getToken(req);
  if (!token) return { userId: null, userEmail: null, isService: false };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return { userId: null, userEmail: null, isService: false };
  }

  return {
    userId: data.user.id,
    userEmail: data.user.email || null,
    isService: data.user.app_metadata?.provider === "service_role",
  };
}

export async function requirePermission(
  userId: string | null,
  permissionCode: string,
): Promise<boolean> {
  if (!userId) return false;

  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("roles:role_id(role_permissions:role_permissions(permission_id, permissions:permission_id(perm_code)))")
    .eq("user_id", userId);

  if (error || !data) return false;

  return data.some((ur: any) =>
    (ur.roles?.role_permissions || []).some(
      (rp: any) => rp.permissions?.perm_code === permissionCode,
    ),
  );
}

export async function writeAuditLog(payload: {
  userId: string | null;
  action: string;
  resource: string;
  success: boolean;
  meta?: Record<string, unknown>;
}) {
  await supabaseAdmin.from("access_audit_logs").insert({
    user_id: payload.userId,
    action: payload.action,
    resource: payload.resource,
    success: payload.success,
    meta: payload.meta || {},
  });
}

export function sendMethodNotAllowed(res: ApiRes, methods: string[]) {
  res.setHeader("Allow", methods.join(", "));
  res.status(405).json({
    ok: false,
    error: `Method not allowed. Use: ${methods.join(", ")}`,
  });
}

export function sendError(res: ApiRes, status: number, message: string, detail?: unknown) {
  res.status(status).json({
    ok: false,
    error: message,
    detail: detail || null,
  });
}

export function sendOk<T>(res: ApiRes, data: T) {
  res.status(200).json({ ok: true, data });
}
