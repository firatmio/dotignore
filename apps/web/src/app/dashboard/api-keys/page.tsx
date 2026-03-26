import { createClient } from "@/lib/supabase/server";
import { ApiKeysContent } from "@/components/api-keys-content";

export default async function ApiKeysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  return <ApiKeysContent initialKeys={apiKeys ?? []} />;
}
