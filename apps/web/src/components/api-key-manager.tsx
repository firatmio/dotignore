"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Plus, Check, Key } from "lucide-react";

interface ApiKey {
  id: string;
  key_prefix: string;
  label: string;
  usage_count: number;
  usage_limit: number | null;
  last_used_at: string | null;
  created_at: string;
}

interface ApiKeyManagerProps {
  initialKeys: ApiKey[];
}

export function ApiKeyManager({ initialKeys }: ApiKeyManagerProps) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [label, setLabel] = useState("Default");

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewKeyValue(data.rawKey);
        setKeys((prev) => [data.apiKey, ...prev]);
        setLabel("Default");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      setKeys((prev) => prev.filter((k) => k.id !== id));
    }
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">API Anahtarları</CardTitle>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Etiket"
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          />
          <Button size="sm" onClick={handleCreate} disabled={creating}>
            <Plus className="mr-1 h-3 w-3" />
            {creating ? "..." : "Oluştur"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Yeni key oluşturuldu — bir kere göster */}
        {newKeyValue && (
          <div className="bg-primary/5 border-primary rounded-lg border p-4">
            <p className="mb-2 text-sm font-medium">
              Yeni API anahtarın oluşturuldu. Bu anahtarı bir daha göremezsin — şimdi kopyala!
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-muted flex-1 rounded px-3 py-2 text-sm">
                {newKeyValue}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(newKeyValue, "new")}
              >
                {copiedId === "new" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        )}

        {/* Key listesi */}
        {keys.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Henüz API anahtarın yok. Yukarıdan oluşturabilirsin.
          </p>
        ) : (
          <div className="space-y-2">
            {keys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Key className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{k.label}</p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {k.key_prefix}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-xs">
                    {k.usage_count} kullanım
                    {k.usage_limit ? ` / ${k.usage_limit}` : ""}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(k.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
