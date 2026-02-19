import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // ✅ await

  return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            // Some Next versions have getAll, some don't
            const anyStore = cookieStore as any;

            if (typeof anyStore.getAll === "function") {
              return anyStore.getAll();
            }

            // Fallback: try the common Supabase cookie keys
            // (still works even if some are missing)
            const names = [
              "sb-access-token",
              "sb-refresh-token",
              "supabase-auth-token",
            ];

            const out: { name: string; value: string }[] = [];
            for (const name of names) {
              const c = cookieStore.get(name);
              if (c?.value) out.push({ name, value: c.value });
            }
            return out;
          },

          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // In some server contexts, cookies are read-only.
            }
          },
        },
      }
  );
}


export function isAdmin(email?: string | null) {
  console.log("user email: ", email)
  const admin = process.env.ADMIN_EMAIL;
  return !!admin && (email ?? "").toLowerCase() === admin.toLowerCase();
}
