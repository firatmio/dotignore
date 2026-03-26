import Link from "next/link";
import { Generator } from "@/components/generator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { FileCode2, Sparkles, Shield, Terminal } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <FileCode2 className="h-5 w-5" />
            dotignore
          </Link>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Ücretsiz Başla</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-8">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="bg-muted text-muted-foreground mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI destekli akıllı .gitignore oluşturucu
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Profesyonel{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
              .gitignore
            </span>{" "}
            dosyaları oluşturun
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg">
            Teknolojilerini seç, AI önerilerini al, çakışmaları tespit et.
            Tek tıkla production-ready .gitignore.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Shield, label: "Çakışma Tespiti" },
              { icon: Sparkles, label: "AI Önerileri" },
              { icon: Terminal, label: "CLI Desteği" },
              { icon: FileCode2, label: "18+ Şablon" },
            ].map((f) => (
              <div
                key={f.label}
                className="bg-card flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
              >
                <f.icon className="text-muted-foreground h-3.5 w-3.5" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="border-t pb-20">
        <div className="container mx-auto max-w-3xl px-4 pt-10">
          <Generator />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto flex items-center justify-between px-4 text-sm">
          <span className="text-muted-foreground">
            © 2026 dotignore. Açık kaynak.
          </span>
          <div className="text-muted-foreground flex gap-4">
            <Link href="/login" className="hover:text-foreground transition">
              API Erişimi
            </Link>
            <span>
              <code className="text-xs">npx dotignore init</code>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
