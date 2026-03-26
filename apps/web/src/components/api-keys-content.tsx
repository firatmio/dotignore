"use client";

import { useTranslation } from "@/lib/i18n/provider";
import { ApiKeyManager } from "@/components/api-key-manager";

interface ApiKeysContentProps {
  initialKeys: Array<{
    id: string;
    key_prefix: string;
    label: string;
    usage_count: number;
    usage_limit: number | null;
    created_at: string;
    last_used_at: string | null;
  }>;
}

export function ApiKeysContent({ initialKeys }: ApiKeysContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.apiKeysPage.title}</h1>
        <p className="text-muted-foreground text-sm">
          {t.dashboard.apiKeysPage.description}
        </p>
      </div>
      <ApiKeyManager initialKeys={initialKeys} />
    </div>
  );
}
