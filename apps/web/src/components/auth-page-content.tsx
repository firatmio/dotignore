"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n/provider";
import { FileCode2 } from "lucide-react";

interface AuthPageContentProps {
  mode: "login" | "register";
}

export function AuthPageContent({ mode }: AuthPageContentProps) {
  const { t } = useTranslation();

  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="from-primary/10 via-primary/5 to-background hidden flex-1 flex-col justify-between bg-gradient-to-b p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FileCode2 className="h-5 w-5" />
          dotignore
        </Link>
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">
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
