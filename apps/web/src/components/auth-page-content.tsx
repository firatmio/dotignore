"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n/provider";
import { FileCode2 } from "lucide-react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  SiJavascript, SiTypescript, SiPython, SiRust, SiGo, SiPhp,
  SiReact, SiVuedotjs, SiNextdotjs, SiAngular, SiSvelte, SiNodedotjs,
  SiDocker, SiKubernetes, SiGithub, SiGitlab, SiGit, SiNpm,
  SiYarn, SiWebpack, SiUbuntu, SiBitbucket, SiNuxt, SiVite,
} from "react-icons/si";

function SI({ c, color }: { c: React.ElementType; color: string }) {
  const Icon = c;
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05]">
      <Icon size={15} color={color} />
    </div>
  );
}

interface AuthPageContentProps {
  mode: "login" | "register";
}

export function AuthPageContent({ mode }: AuthPageContentProps) {
  const { t } = useTranslation();

  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen">
      {/* Left panel — orbiting circles */}
      <div className="from-primary/10 via-primary/5 to-background relative hidden flex-1 flex-col overflow-hidden bg-gradient-to-b lg:flex">
        {/* Brand */}
        <div className="relative z-10 flex-shrink-0 p-10 pb-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <img src="/logo.svg" alt="dotignore logo" className="h-5 w-5" />
            dotignore
          </Link>
        </div>

        {/* Orbiting tech logos */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          {/* Center */}
          <div className="z-10 flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/30 backdrop-blur-md">
              <img src="/logo.svg" alt="dotignore" className="h-8 w-8" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white/70">dotignore</span>
          </div>

          {/* Inner orbit — languages */}
          <OrbitingCircles radius={90} duration={22} iconSize={34}>
            <SI c={SiJavascript}  color="#F7DF1E" />
            <SI c={SiPython}      color="#4B8BBE" />
            <SI c={SiRust}        color="#CE422B" />
            <SI c={SiTypescript}  color="#3178C6" />
            <SI c={SiGo}          color="#00ADD8" />
          </OrbitingCircles>

          {/* Middle orbit — frameworks / tools (reverse) */}
          <OrbitingCircles radius={155} duration={35} reverse iconSize={36}>
            <SI c={SiReact}      color="#61DAFB" />
            <SI c={SiVuedotjs}   color="#4FC08D" />
            <SI c={SiNextdotjs}  color="#E2E8F0" />
            <SI c={SiDocker}     color="#2496ED" />
            <SI c={SiGit}        color="#F05032" />
            <SI c={SiAngular}    color="#DD0031" />
            <SI c={SiNodedotjs}  color="#68A063" />
          </OrbitingCircles>

          {/* Outer orbit — platforms / devops */}
          <OrbitingCircles radius={220} duration={50} iconSize={36}>
            <SI c={SiGithub}      color="#E2E8F0" />
            <SI c={SiGitlab}      color="#FC6D26" />
            <SI c={SiKubernetes}  color="#326CE5" />
            <SI c={SiNpm}         color="#CB3837" />
            <SI c={SiVite}        color="#646CFF" />
            <SI c={SiUbuntu}      color="#E95420" />
            <SI c={SiSvelte}      color="#FF3E00" />
            <SI c={SiNuxt}        color="#00DC82" />
            <SI c={SiWebpack}     color="#8DD6F9" />
          </OrbitingCircles>
        </div>

        {/* Quote */}
        <div className="relative z-10 flex-shrink-0 space-y-1.5 p-10 pt-6">
          <p className="text-muted-foreground text-base leading-relaxed">
            &ldquo;{isLogin ? t.auth.loginQuote : t.auth.registerQuote}&rdquo;
          </p>
          <p className="text-muted-foreground text-sm">
            {isLogin ? t.auth.loginQuoteDesc : t.auth.registerQuoteDesc}
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="relative flex flex-1 items-center justify-center p-6">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="mb-4 flex items-center justify-center gap-2 font-bold lg:hidden"
            >
              <FileCode2 className="h-5 w-5" />
              dotignore
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? t.auth.loginDesc : t.auth.registerDesc}
            </p>
          </div>

          <AuthForm mode={mode} />

          <p className="text-muted-foreground text-center text-sm">
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              {isLogin ? t.auth.freeRegister : t.auth.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
