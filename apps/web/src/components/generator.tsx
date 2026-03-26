"use client";

import { useState, useEffect } from "react";
import type { Template, TemplateCategory, Conflict } from "@dotignore/shared";
import { TemplateSelector } from "@/components/template-selector";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/provider";

interface GenerateResult {
  content: string;
  conflicts: Conflict[];
  templateCount: number;
}

const categoryOrder: TemplateCategory[] = ["language", "framework", "os", "ide"];

export function Generator() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const categoryLabels: Record<TemplateCategory, string> = {
    language: t.components.generator.languages,
    framework: t.components.generator.frameworks,
    os: t.components.generator.os,
    ide: t.components.generator.editors,
  };

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data: Template[]) => setTemplates(data))
      .catch(() => setError(t.components.generator.templateLoadError));
  }, []);

  function toggleTemplate(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleGenerate() {
    if (selected.size === 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templates: Array.from(selected) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t.common.error);
        return;
      }

      setResult(data as GenerateResult);
    } catch {
      setError(t.components.generator.connectionError);
    } finally {
      setLoading(false);
    }
  }

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      items: templates.filter((t) => t.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      {/* Şablon Seçici */}
      <div className="space-y-6">
        {grouped.map((group) => (
          <TemplateSelector
            key={group.category}
            label={group.label}
            templates={group.items}
            selected={selected}
            onToggle={toggleTemplate}
          />
        ))}
      </div>

      {/* Oluştur Butonu */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleGenerate}
          disabled={selected.size === 0 || loading}
          size="lg"
        >
          {loading ? t.components.generator.generating : `${t.components.generator.generateButton} (${selected.size} ${t.components.generator.templatesSelected})`}
        </Button>
        {selected.size > 0 && (
          <button
            onClick={() => setSelected(new Set())}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {t.components.generator.clearSelection}
          </button>
        )}
      </div>

      {/* Hata */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Sonuç */}
      {result && <OutputPanel content={result.content} conflicts={result.conflicts} />}
    </div>
  );
}
