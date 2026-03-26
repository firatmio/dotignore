"use client";

import type { Template } from "@dotignore/shared";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface TemplateSelectorProps {
  label: string;
  templates: Template[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function TemplateSelector({ label, templates, selected, onToggle }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide uppercase">{label}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {templates.map((t) => (
          <label
            key={t.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
              selected.has(t.id)
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={selected.has(t.id)}
              onCheckedChange={() => onToggle(t.id)}
            />
            <span className="flex-1 text-sm font-medium">{t.name}</span>
            <Badge variant={t.source === "github" ? "secondary" : "outline"} className="text-[10px]">
              {t.source === "github" ? "GH" : "Custom"}
            </Badge>
          </label>
        ))}
      </div>
    </div>
  );
}
