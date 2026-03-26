import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ApiKeyManager } from "@/components/api-key-manager";
import { SignOutButton } from "@/components/sign-out-button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Kullanıcı bilgilerini al
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // API key'lerini al
  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Profil */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={profile?.plan === "pro" ? "default" : "secondary"}>
              {profile?.plan === "pro" ? "Pro" : "Free"}
            </Badge>
            <SignOutButton />
          </div>
        </div>

        {/* API Key Yönetimi */}
        <ApiKeyManager initialKeys={apiKeys ?? []} />
      </div>
    </div>
  );
}
