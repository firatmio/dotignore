"use client";

import { Generator } from "@/components/generator";
import { useTranslation } from "@/lib/i18n/provider";

export default function GeneratorPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t.dashboard.generator.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t.dashboard.generator.description}
        </p>
      </div>
      <Generator />
    </div>
  );
}
