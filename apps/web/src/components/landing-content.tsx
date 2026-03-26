"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/provider";
import {
  FileCode2,
  Sparkles,
  Shield,
  Terminal,
  Zap,
  Globe,
  ArrowRight,
  Check,
  Code2,
  Layers,
  GitBranch,
} from "lucide-react";

export function LandingContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useTranslation();

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
              {t.landing.nav.features}
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              {t.landing.nav.howItWorks}
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              {t.landing.nav.pricing}
            </a>
            <a href="#cli" className="text-muted-foreground hover:text-foreground transition">
              {t.landing.nav.cli}
            </a>
          </nav>
          <nav className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm">{t.common.dashboard}</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t.common.login}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t.landing.nav.startFree}</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-primary/8 absolute top-[-20%] left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="bg-primary/10 text-primary mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            {t.landing.hero.badge}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t.landing.hero.titlePre}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
              {t.landing.hero.titleHighlight}
            </span>{" "}
            {t.landing.hero.titlePost}
            <br />
            {t.landing.hero.titleBreak}
          </h1>

          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
            {t.landing.hero.description}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8 text-base">
                {t.landing.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#cli">
              <Button variant="outline" size="lg" className="gap-2 px-8 text-base">
                <Terminal className="h-4 w-4" />
                {t.landing.hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              { icon: Shield, label: t.landing.pills.conflictDetection },
              { icon: Sparkles, label: t.landing.pills.aiSuggestions },
              { icon: Terminal, label: t.landing.pills.cliSupport },
              { icon: FileCode2, label: t.landing.pills.templates },
              { icon: Zap, label: t.landing.pills.instantGeneration },
              { icon: Globe, label: t.landing.pills.restApi },
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
            { value: "18+", label: t.landing.stats.templates },
            { value: "3", label: t.landing.stats.conflictTypes },
            { value: "∞", label: t.landing.stats.freeUsage },
            { value: "<1s", label: t.landing.stats.generationTime },
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
              {t.landing.features.title}
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Layers,
                title: t.landing.features.smartTemplates,
                desc: t.landing.features.smartTemplatesDesc,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Sparkles,
                title: t.landing.features.aiSuggestions,
                desc: t.landing.features.aiSuggestionsDesc,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
              {
                icon: Shield,
                title: t.landing.features.conflictDetection,
                desc: t.landing.features.conflictDetectionDesc,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                icon: Terminal,
                title: t.landing.features.powerfulCli,
                desc: t.landing.features.powerfulCliDesc,
                color: "text-sky-500",
                bg: "bg-sky-500/10",
              },
              {
                icon: Code2,
                title: t.landing.features.restApi,
                desc: t.landing.features.restApiDesc,
                color: "text-rose-500",
                bg: "bg-rose-500/10",
              },
              {
                icon: GitBranch,
                title: t.landing.features.mergeAndCombine,
                desc: t.landing.features.mergeAndCombineDesc,
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
              {t.landing.howItWorks.title}
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              {t.landing.howItWorks.subtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: t.landing.howItWorks.step1Title, desc: t.landing.howItWorks.step1Desc },
              { step: "02", title: t.landing.howItWorks.step2Title, desc: t.landing.howItWorks.step2Desc },
              { step: "03", title: t.landing.howItWorks.step3Title, desc: t.landing.howItWorks.step3Desc },
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
                {t.landing.cli.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t.landing.cli.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.landing.cli.description}
              </p>
              <div className="space-y-2 pt-2">
                {[t.landing.cli.cmd1, t.landing.cli.cmd2, t.landing.cli.cmd3].map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary h-4 w-4 shrink-0" />
                    <code className="text-muted-foreground">{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
            {/* Mock terminal */}
            <div className="overflow-hidden rounded-xl border border-[#28282d] bg-[#121214] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#28282d] px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-white/40">terminal</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="text-green-400">$ npx dotignore init</div>
                <div className="mt-2 text-slate-400">
                  ? {t.landing.cli.terminalTech}{" "}
                  <span className="text-cyan-400">Node.js, React, TypeScript</span>
                </div>
                <div className="text-slate-400">
                  ? {t.landing.cli.terminalAi}{" "}
                  <span className="text-cyan-400">{t.landing.cli.terminalYes}</span>
                </div>
                <div className="mt-2 text-emerald-400">
                  {t.landing.cli.terminalCreated}
                </div>
                <div className="text-emerald-400">{t.landing.cli.terminalConflicts}</div>
                <div className="mt-1 text-slate-500">{t.landing.cli.terminalSaved}</div>
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
              {t.landing.pricing.title}
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              {t.landing.pricing.subtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="bg-card rounded-xl border p-8">
              <h3 className="text-lg font-semibold">{t.landing.pricing.freeTitle}</h3>
              <div className="mt-2">
                <span className="text-4xl font-extrabold">{t.landing.pricing.freePrice}</span>
                <span className="text-muted-foreground ml-1 text-sm">{t.landing.pricing.perMonth}</span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">
                {t.landing.pricing.freeDesc}
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  t.landing.pricing.freeFeature1,
                  t.landing.pricing.freeFeature2,
                  t.landing.pricing.freeFeature3,
                  t.landing.pricing.freeFeature4,
                  t.landing.pricing.freeFeature5,
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block">
                <Button variant="outline" className="w-full">
                  {t.landing.pricing.freeCta}
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-card relative rounded-xl border-2 border-primary p-8">
              <div className="bg-primary text-primary-foreground absolute -top-3 right-6 rounded-full px-3 py-0.5 text-xs font-medium">
                {t.landing.pricing.proBadge}
              </div>
              <h3 className="text-lg font-semibold">{t.landing.pricing.proTitle}</h3>
              <div className="mt-2">
                <span className="text-4xl font-extrabold">{t.landing.pricing.proPrice}</span>
                <span className="text-muted-foreground ml-1 text-sm">{t.landing.pricing.perMonth}</span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">
                {t.landing.pricing.proDesc}
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  t.landing.pricing.proFeature1,
                  t.landing.pricing.proFeature2,
                  t.landing.pricing.proFeature3,
                  t.landing.pricing.proFeature4,
                  t.landing.pricing.proFeature5,
                  t.landing.pricing.proFeature6,
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block">
                <Button className="w-full">{t.landing.pricing.proCta}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.landing.cta.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            {t.landing.cta.description}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8 text-base">
                {t.landing.cta.button}
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
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
                  <FileCode2 className="h-3.5 w-3.5" />
                </div>
                dotignore
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.landing.footer.brand}
                <br />
                {t.landing.footer.brandSub}
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">{t.landing.footer.product}</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/register" className="hover:text-foreground transition">
                    {t.common.dashboard}
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground transition">
                    {t.landing.footer.apiAccess}
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition">
                    {t.landing.nav.pricing}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">{t.landing.footer.developers}</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/register" className="hover:text-foreground transition">
                    {t.landing.footer.documentation}
                  </Link>
                </li>
                <li>
                  <span className="hover:text-foreground cursor-default transition">
                    CLI — <code className="text-xs">npx dotignore</code>
                  </span>
                </li>
                <li>
                  <a href="#cli" className="hover:text-foreground transition">
                    {t.landing.footer.examples}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">{t.landing.footer.legal}</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <span className="hover:text-foreground cursor-default transition">
                    {t.landing.footer.privacy}
                  </span>
                </li>
                <li>
                  <span className="hover:text-foreground cursor-default transition">
                    {t.landing.footer.terms}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-muted-foreground mt-10 border-t pt-6 text-center text-sm">
            {t.landing.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
