"use client";

import { useTranslation } from "@/lib/i18n/provider";
import { AccountForm } from "@/components/account-form";

interface AccountContentProps {
  user: {
    id: string;
    email: string;
    plan: string;
    createdAt: string;
    hasPassword: boolean;
    providers: string[];
  };
}

export function AccountContent({ user }: AccountContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.accountPage.title}</h1>
        <p className="text-muted-foreground text-sm">
          {t.dashboard.accountPage.description}
        </p>
      </div>
      <AccountForm user={user} />
    </div>
  );
}
