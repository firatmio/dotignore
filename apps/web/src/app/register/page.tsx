import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { FileCode2 } from "lucide-react";
import Link from "next/link";

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sol panel — branding */}
      <div className="from-primary/10 via-primary/5 to-background hidden flex-1 flex-col justify-between bg-gradient-to-b p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FileCode2 className="h-5 w-5" />
          dotignore
        </Link>
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">
            &ldquo;Profesyonel .gitignore dosyaları oluşturun.&rdquo;
          </p>
          <p className="text-muted-foreground text-sm">
            Ücretsiz plan ile başlayın, ihtiyacınız oldukça yükseltin.
          </p>
        </div>
      </div>

      {/* Sağ panel — form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="mb-4 flex items-center justify-center gap-2 font-bold lg:hidden"
            >
              <FileCode2 className="h-5 w-5" />
              dotignore
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Hesap oluşturun</h1>
            <p className="text-muted-foreground text-sm">
              Ücretsiz hesabınızı oluşturun ve başlayın
            </p>
          </div>

          <AuthForm mode="register" />

          <p className="text-muted-foreground text-center text-sm">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
