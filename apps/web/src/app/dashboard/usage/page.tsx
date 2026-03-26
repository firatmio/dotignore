import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

  // Toplam kullanım
  const { count: totalRequests } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  // Bugünkü kullanım
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayRequests } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .gte("created_at", today.toISOString());

  // API key kullanımları
  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("id, key_prefix, label, usage_count, usage_limit, last_used_at")
    .order("usage_count", { ascending: false });

  // Son 7 gün log
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { data: weekLogs } = await supabase
    .from("usage_logs")
    .select("created_at, endpoint")
    .eq("user_id", user!.id)
    .gte("created_at", weekAgo.toISOString())
    .order("created_at", { ascending: false });

  // Günlük dağılım hesapla
  const dailyMap = new Map<string, number>();
  const dayLabels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
    dayLabels.push(
      d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" })
    );
  }
  weekLogs?.forEach((log) => {
    const key = log.created_at.slice(0, 10);
    if (dailyMap.has(key)) {
      dailyMap.set(key, dailyMap.get(key)! + 1);
    }
  });
  const dailyValues = Array.from(dailyMap.values());
  const maxDaily = Math.max(...dailyValues, 1);

  // Endpoint dağılımı
  const endpointMap = new Map<string, number>();
  weekLogs?.forEach((log) => {
    endpointMap.set(log.endpoint, (endpointMap.get(log.endpoint) ?? 0) + 1);
  });
  const endpoints = Array.from(endpointMap.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  const dailyLimit = profile?.plan === "pro" ? Infinity : 20;
  const usagePercent =
    dailyLimit === Infinity
      ? 0
      : Math.min(100, ((todayRequests ?? 0) / dailyLimit) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Kullanımı</h1>
        <p className="text-muted-foreground text-sm">
          API kullanım istatistiklerinizi görüntüleyin
        </p>
      </div>

      {/* Özet kartları */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bugün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRequests ?? 0}</div>
            {profile?.plan !== "pro" && (
              <div className="mt-2 space-y-1">
                <Progress value={usagePercent} className="h-2" />
                <p className="text-muted-foreground text-xs">
                  {todayRequests ?? 0} / {dailyLimit} günlük limit
                </p>
              </div>
            )}
            {profile?.plan === "pro" && (
              <p className="text-muted-foreground text-xs">Sınırsız</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekLogs?.length ?? 0}</div>
            <p className="text-muted-foreground text-xs">Son 7 gün</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests ?? 0}</div>
            <p className="text-muted-foreground text-xs">Tüm zamanlar</p>
          </CardContent>
        </Card>
      </div>

      {/* Haftalık grafik (basit bar chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Haftalık Kullanım</CardTitle>
          <CardDescription>Son 7 günlük istek dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2">
            {dailyValues.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-muted-foreground text-xs">{val}</span>
                <div
                  className="bg-primary w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(4, (val / maxDaily) * 120)}px`,
                  }}
                />
                <span className="text-muted-foreground text-[10px]">
                  {dayLabels[i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Endpoint dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Endpoint Dağılımı</CardTitle>
            <CardDescription>Son 7 gün</CardDescription>
          </CardHeader>
          <CardContent>
            {endpoints.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Henüz veri yok
              </p>
            ) : (
              <div className="space-y-3">
                {endpoints.map(([endpoint, count]) => (
                  <div key={endpoint} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-xs">{endpoint}</code>
                      <span className="text-muted-foreground text-xs">
                        {count} istek
                      </span>
                    </div>
                    <Progress
                      value={(count / (weekLogs?.length ?? 1)) * 100}
                      className="h-1.5"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key bazlı kullanım */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Anahtar Kullanımı</CardTitle>
            <CardDescription>API anahtarı başına</CardDescription>
          </CardHeader>
          <CardContent>
            {!apiKeys || apiKeys.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Henüz API anahtarı yok
              </p>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{k.label}</p>
                      <code className="text-muted-foreground text-xs">
                        {k.key_prefix}...
                      </code>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {k.usage_count}
                        {k.usage_limit && (
                          <span className="text-muted-foreground">
                            {" "}
                            / {k.usage_limit}
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {k.last_used_at
                          ? new Date(k.last_used_at).toLocaleDateString(
                              "tr-TR"
                            )
                          : "Hiç kullanılmadı"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
