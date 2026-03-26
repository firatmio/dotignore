import { createClient } from "@/lib/supabase/server";
import { UsageContent } from "@/components/dashboard-usage-content";

export default async function UsagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user!.id)
    .single();

  const { count: totalRequests } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayRequests } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .gte("created_at", today.toISOString());

  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("id, key_prefix, label, usage_count, usage_limit, last_used_at")
    .order("usage_count", { ascending: false });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { data: weekLogs } = await supabase
    .from("usage_logs")
    .select("created_at, endpoint")
    .eq("user_id", user!.id)
    .gte("created_at", weekAgo.toISOString())
    .order("created_at", { ascending: false });

  return (
    <UsageContent
      plan={profile?.plan ?? "free"}
      totalRequests={totalRequests ?? 0}
      todayRequests={todayRequests ?? 0}
      weekLogs={weekLogs ?? []}
      apiKeys={apiKeys ?? []}
    />
  );
}
