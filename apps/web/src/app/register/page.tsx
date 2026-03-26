import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthPageContent } from "@/components/auth-page-content";

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <AuthPageContent mode="register" />;
}
