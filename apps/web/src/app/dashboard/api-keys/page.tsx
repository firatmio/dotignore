import { createClient } from "@/lib/supabase/server";
import { ApiKeyManager } from "@/components/api-key-manager";

export default async function ApiKeysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Anahtarları</h1>
        <p className="text-muted-foreground text-sm">
          API erişimi için anahtarlarınızı yönetin
        </p>
      </div>
      <ApiKeyManager initialKeys={apiKeys ?? []} />
    </div>
  );
}
