import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Key, BarChart3, FileCode2, Sparkles } from "lucide-react";

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
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Hoş geldin, {user!.email?.split("@")[0]}
          </p>
        </div>
        <Badge
          variant={profile?.plan === "pro" ? "default" : "secondary"}
          className="text-xs"
        >
          {profile?.plan === "pro" ? "Pro Plan" : "Free Plan"}
        </Badge>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Anahtarları</CardTitle>
            <Key className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyCount ?? 0}</div>
            <p className="text-muted-foreground text-xs">Aktif anahtar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam İstek
            </CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageCount ?? 0}</div>
            <p className="text-muted-foreground text-xs">API çağrısı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Sparkles className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {profile?.plan ?? "free"}
            </div>
            <p className="text-muted-foreground text-xs">
              {profile?.plan === "pro"
                ? "Sınırsız AI erişimi"
                : "Günlük 20 istek"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Şablonlar</CardTitle>
            <FileCode2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18+</div>
            <p className="text-muted-foreground text-xs">Hazır şablon</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hızlı Erişim</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/generator">
              <Button variant="outline" className="w-full justify-start">
                <FileCode2 className="mr-2 h-4 w-4" />
                .gitignore Oluştur
              </Button>
            </Link>
            <Link href="/dashboard/api-keys">
              <Button variant="outline" className="w-full justify-start">
                <Key className="mr-2 h-4 w-4" />
                API Anahtarı Oluştur
              </Button>
            </Link>
            <Link href="/dashboard/docs">
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="mr-2 h-4 w-4" />
                API Dokümantasyonu
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Son Aktivite</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentUsage || recentUsage.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Henüz aktivite yok
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsage.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-2 w-2 rounded-full" />
                      <code className="text-muted-foreground text-xs">
                        {log.endpoint}
                      </code>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(log.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
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
