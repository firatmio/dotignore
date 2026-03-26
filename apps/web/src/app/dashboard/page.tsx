import { createClient } from "@/lib/supabase/server";
import { DashboardOverviewContent } from "@/components/dashboard-overview-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { count: keyCount } = await supabase
    .from("api_keys")
    .select("*", { count: "exact", head: true });

  const { count: usageCount } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: recentUsage } = await supabase
    .from("usage_logs")
    .select("id, endpoint, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <DashboardOverviewContent
      userEmail={user!.email ?? ""}
      plan={profile?.plan ?? "free"}
      keyCount={keyCount ?? 0}
      usageCount={usageCount ?? 0}
      recentUsage={recentUsage ?? []}
    />
  );
}
