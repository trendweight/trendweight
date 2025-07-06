import { redirect } from "@tanstack/react-router";
import { supabase } from "../supabase/client";

interface BeforeLoadContext {
  location: {
    pathname: string;
    href: string;
    search: Record<string, unknown>;
  };
}

/**
 * TanStack Router beforeLoad guard for protected routes.
 * Checks authentication state and redirects to login if not authenticated.
 *
 * Usage:
 * export const Route = createFileRoute('/dashboard')({
 *   beforeLoad: requireAuth,
 *   component: DashboardPage,
 * })
 */
export async function requireAuth({ location }: BeforeLoadContext) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to login with the original destination
    throw redirect({
      to: "/login",
      search: {
        from: location.pathname,
      },
    });
  }
}
