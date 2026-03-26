import { createClient } from "@/lib/supabase/server";
import { AccountForm } from "@/components/account-form";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hesap Ayarları</h1>
        <p className="text-muted-foreground text-sm">
          Profilinizi ve güvenlik ayarlarınızı yönetin
        </p>
      </div>
      <AccountForm
        user={{
          id: user!.id,
          email: user!.email ?? "",
          plan: profile?.plan ?? "free",
          createdAt: user!.created_at,
          hasPassword,
          providers: providers as string[],
        }}
      />
    </div>
  );
}
