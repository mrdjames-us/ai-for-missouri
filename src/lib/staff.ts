import { createMiddleware } from "@tanstack/react-start";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "Not on staff") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export type StaffMember = {
  email: string;
  name: string | null;
  role: "owner" | "editor";
};

export type StaffSession = {
  userId: string;
  email: string;
  role: "owner" | "editor";
  name: string | null;
};

async function requireStaff(bearerToken?: string): Promise<StaffSession> {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const { getSql } = await import("@/lib/db");
  const user = await getSessionUser(bearerToken);
  if (!user?.id) {
    const { UnauthorizedError } = await import("@/lib/auth/verify.server");
    throw new UnauthorizedError();
  }
  const email = user.email?.trim().toLowerCase();
  if (!email) throw new ForbiddenError("This account has no email on file.");
  const sql = await getSql();
  const rows = await sql<{ email: string; name: string | null; role: "owner" | "editor" }>`
    select email, name, role from staff where lower(email) = ${email}
  `;
  const row = rows[0];
  if (!row) {
    throw new ForbiddenError(
      "You are signed in, but this email is not on the staff list yet. Ask David to add you.",
    );
  }
  return { userId: user.id, email: row.email, role: row.role, name: row.name };
}

export const staffMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getBearerToken } = await import("@/lib/auth/client");
    return next({ sendContext: { bearerToken: getBearerToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    assertSameSiteRequest();
    const staff = await requireStaff(context.bearerToken);
    return next({ context: { userId: staff.userId, staff } });
  });

export const getStaffSession = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .handler(async ({ context }) => context.staff);

export const listStaff = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .handler(async () => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<StaffMember>`
      select email, name, role from staff order by role desc, email
    `;
    return rows.map((row) => ({
      email: row.email,
      name: row.name,
      role: row.role,
    }));
  });

export const addStaff = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator(
    z.object({
      email: z.string().email(),
      name: z.string().trim().max(80).optional(),
      role: z.enum(["owner", "editor"]).default("editor"),
    }),
  )
  .handler(async ({ data, context }) => {
    if (context.staff.role !== "owner") {
      throw new ForbiddenError("Only an owner can add staff.");
    }
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const email = data.email.trim().toLowerCase();
    await sql`
      insert into staff (email, name, role)
      values (${email}, ${data.name?.trim() || null}, ${data.role})
      on conflict (email) do update set
        name = coalesce(excluded.name, staff.name),
        role = excluded.role
    `;
    return { ok: true as const, email };
  });

export const removeStaff = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data, context }) => {
    if (context.staff.role !== "owner") {
      throw new ForbiddenError("Only an owner can remove staff.");
    }
    const email = data.email.trim().toLowerCase();
    if (email === context.staff.email) {
      throw new ForbiddenError("You cannot remove yourself.");
    }
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const owners = await sql<{ n: number }>`
      select count(*)::int as n from staff where role = 'owner'
    `;
    const target = await sql<{ role: string }>`
      select role from staff where lower(email) = ${email}
    `;
    if (target[0]?.role === "owner" && (owners[0]?.n ?? 0) <= 1) {
      throw new ForbiddenError("Keep at least one owner on the list.");
    }
    await sql`delete from staff where lower(email) = ${email}`;
    return { ok: true as const };
  });
