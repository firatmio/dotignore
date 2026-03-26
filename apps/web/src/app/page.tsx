import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  FileCode2,
  Sparkles,
  Shield,
  Terminal,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Check,
  Code2,
  Layers,
  GitBranch,
} from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Navbar ─── */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-lg">
              <FileCode2 className="h-4 w-4" />
            </div>
            dotignore
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">
              Özellikler
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              Nasıl Çalışır
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Fiyatlandırma
            </a>
            <a href="#cli" className="text-muted-foreground hover:text-foreground transition">
              CLI
            </a>
          </nav>
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

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-primary/8 absolute top-[-20%] left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="bg-primary/10 text-primary mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            AI destekli akıllı .gitignore oluşturucu
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Profesyonel{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
              .gitignore
            </span>{" "}
            dosyaları
            <br />
            saniyeler içinde
          </h1>

          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
            Teknolojini seç, AI önerilerini al, çakışmaları otomatik tespit et.
            18+ hazır şablon, güçlü CLI ve REST API ile her projene
            production-ready .gitignore.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8 text-base">
                Ücretsiz Başla
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#cli">
              <Button variant="outline" size="lg" className="gap-2 px-8 text-base">
                <Terminal className="h-4 w-4" />
                npx dotignore init
              </Button>
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              { icon: Shield, label: "Çakışma Tespiti" },
              { icon: Sparkles, label: "AI Önerileri" },
              { icon: Terminal, label: "CLI Desteği" },
              { icon: FileCode2, label: "18+ Şablon" },
              { icon: Zap, label: "Anlık Oluşturma" },
              { icon: Globe, label: "REST API" },
            ].map((f) => (
              <div
                key={f.label}
                className="bg-card flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm"
              >
                <f.icon className="text-primary h-3.5 w-3.5" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Band ─── */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
          {[
            { value: "18+", label: "Hazır Şablon" },
            { value: "3", label: "Çakışma Türü Analizi" },
            { value: "∞", label: "Ücretsiz Kullanım" },
            { value: "<1s", label: "Oluşturma Süresi" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-primary text-3xl font-extrabold">{s.value}</div>
              <div className="text-muted-foreground mt-1 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Her şey tek platformda
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              dotignore, .gitignore yönetimini uçtan uca çözer.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "18+ Akıllı Şablon",
                desc: "Node.js, Python, React, Go, Rust, Docker ve daha fazlası. Kategorilere ayrılmış, sürekli güncellenen şablonlar.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Sparkles,
                title: "AI Destekli Öneriler",
                desc: "Claude AI, projenin yapısını analiz ederek ekstra gitignore kuralları önerir. Akıllı ve bağlama duyarlı.",
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
              {
                icon: Shield,
                title: "Çakışma Tespiti",
                desc: "Negation override, duplicate ve redundant çakışmalarını otomatik tespit. Temiz, hatasız dosyalar.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                icon: Terminal,
                title: "Güçlü CLI",
                desc: "npx dotignore init ile interaktif oluşturma. Pipe desteği, CI/CD entegrasyonu, her yerde çalışır.",
                color: "text-sky-500",
                bg: "bg-sky-500/10",
              },
              {
                icon: Code2,
                title: "REST API",
                desc: "API anahtarı ile programatik erişim. Generate, AI suggest ve template endpoint'leri. Rate limit koruması.",
                color: "text-rose-500",
                bg: "bg-rose-500/10",
              },
              {
                icon: GitBranch,
                title: "Merge & Birleştir",
                desc: "Birden fazla şablonu akıllıca birleştir. Duplikat kuralları otomatik temizle, sıralı çıktı al.",
                color: "text-teal-500",
                bg: "bg-teal-500/10",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-card group rounded-xl border p-6 shadow-sm transition hover:shadow-md"
              >
                <div className={`${f.bg} ${f.color} flex h-10 w-10 items-center justify-center rounded-lg`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="border-y bg-muted/30 px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              3 adımda hazır
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Karmaşık config dosyalarıyla uğraşmayı bırak.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Teknolojini Seç",
                desc: "Dashboard'dan veya CLI ile kullandığın teknolojileri seç. Node.js + React + Docker gibi birden fazla seçebilirsin.",
              },
              {
                step: "02",
                title: "AI Analiz Etsin",
                desc: "Claude AI projen için ek kurallar önerir. Hassas dosyalar, build artifact'leri ve ortam değişkenleri otomatik eklenir.",
              },
              {
                step: "03",
                title: "İndir & Kullan",
                desc: "Çakışma kontrolünden geçmiş, production-ready .gitignore dosyanı tek tıkla indir veya kopyala.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center md:text-left">
                <div className="text-primary text-4xl font-extrabold opacity-30">
                  {s.step}
                </div>
                <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLI Showcase ─── */}
      <section id="cli" className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                <Terminal className="h-3 w-3" />
                CLI
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Terminal&apos;den ayrılma
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                dotignore CLI ile doğrudan terminal&apos;den .gitignore oluştur.
                Interaktif mod, AI desteği ve çakışma analizi — hepsi bir komut uzağında.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  "npx dotignore init — interaktif oluşturma",
                  "npx dotignore ai — AI destekli öneri",
                  "npx dotignore check — çakışma analizi",
                ].map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary h-4 w-4 shrink-0" />
                    <code className="text-muted-foreground">{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
            {/* Mock terminal */}
            <div className="overflow-hidden rounded-xl border bg-slate-950 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-white/40">terminal</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="text-green-400">$ npx dotignore init</div>
                <div className="mt-2 text-slate-400">
                  ? Kullanacağın teknolojiler:{" "}
                  <span className="text-cyan-400">Node.js, React, TypeScript</span>
                </div>
                <div className="text-slate-400">
                  ? AI önerileri eklensin mi?{" "}
                  <span className="text-cyan-400">Evet</span>
                </div>
                <div className="mt-2 text-emerald-400">
                  ✓ .gitignore oluşturuldu (47 kural)
                </div>
                <div className="text-emerald-400">✓ 0 çakışma tespit edildi</div>
                <div className="mt-1 text-slate-500">→ .gitignore dosyası kaydedildi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="border-y bg-muted/30 px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Basit & şeffaf fiyatlandırma
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Başlamak için kredi kartı gerekmez.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="bg-card rounded-xl border p-8">
              <h3 className="text-lg font-semibold">Free</h3>
              <div className="mt-2">
                <span className="text-4xl font-extrabold">₺0</span>
                <span className="text-muted-foreground ml-1 text-sm">/ay</span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">
                Bireysel geliştiriciler için yeterli.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Günde 20 generate isteği",
                  "18+ hazır şablon",
                  "Çakışma tespiti",
                  "CLI erişimi",
                  "Web Dashboard",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block">
                <Button variant="outline" className="w-full">
                  Ücretsiz Başla
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-card relative rounded-xl border-2 border-primary p-8">
              <div className="bg-primary text-primary-foreground absolute -top-3 right-6 rounded-full px-3 py-0.5 text-xs font-medium">
                Popüler
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-2">
                <span className="text-4xl font-extrabold">₺49</span>
                <span className="text-muted-foreground ml-1 text-sm">/ay</span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">
                Takımlar ve yoğun kullanıcılar için.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Sınırsız generate isteği",
                  "AI destekli öneriler",
                  "Öncelikli API erişimi",
                  "Birden fazla API anahtarı",
                  "Öncelikli destek",
                  "Erken erişim özellikler",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block">
                <Button className="w-full">Pro&apos;ya Geç</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Hala elle .gitignore mi yazıyorsun?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            Binlerce geliştirici dotignore ile daha hızlı ve hatasız .gitignore
            dosyaları oluşturuyor. Sen de katıl.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8 text-base">
                Hemen Başla — Ücretsiz
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
                  <FileCode2 className="h-3.5 w-3.5" />
                </div>
                dotignore
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Akıllı .gitignore oluşturucu.
                <br />
                AI destekli, açık kaynak.
              </p>
            </div>
            {/* Product */}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Ürün</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/register" className="hover:text-foreground transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground transition">
                    API Erişimi
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition">
                    Fiyatlandırma
                  </a>
                </li>
              </ul>
            </div>
            {/* Developers */}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Geliştiriciler</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/register" className="hover:text-foreground transition">
                    Dokümantasyon
                  </Link>
                </li>
                <li>
                  <span className="hover:text-foreground cursor-default transition">
                    CLI — <code className="text-xs">npx dotignore</code>
                  </span>
                </li>
                <li>
                  <a href="#cli" className="hover:text-foreground transition">
                    Örnekler
                  </a>
                </li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Yasal</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <span className="hover:text-foreground cursor-default transition">
                    Gizlilik Politikası
                  </span>
                </li>
                <li>
                  <span className="hover:text-foreground cursor-default transition">
                    Kullanım Koşulları
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-muted-foreground mt-10 border-t pt-6 text-center text-sm">
            © 2026 dotignore. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
