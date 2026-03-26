import { createClient } from "@/lib/supabase/server";
import { AccountContent } from "@/components/account-content";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const providers =
    user!.app_metadata?.providers ?? (user!.app_metadata?.provider ? [user!.app_metadata.provider] : ["email"]);

  const hasPassword = providers.includes("email");

  return (
    <AccountContent
      user={{
        id: user!.id,
        email: user!.email ?? "",
        plan: profile?.plan ?? "free",
        createdAt: user!.created_at,
        hasPassword,
        providers: providers as string[],
      }}
    />
  );
}
