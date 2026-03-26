"use client";

import { useState } from "react";
import type { Conflict } from "@dotignore/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, Download, Check } from "lucide-react";

interface OutputPanelProps {
  content: string;
  conflicts: Conflict[];
}

export function OutputPanel({ content, conflicts }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".gitignore";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Çakışma Uyarıları */}
      {conflicts.length > 0 && (
        <div className="space-y-2">
          {conflicts.map((c, i) => (
            <Alert key={i} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm font-medium">
                {c.type === "negation-override"
                  ? "Negation Çakışması"
                  : c.type === "duplicate"
                    ? "Tekrar Eden Kural"
                    : c.type === "redundant"
                      ? "Gereksiz Kural"
                      : "Sıralama Çakışması"}
              </AlertTitle>
              <AlertDescription className="text-xs">{c.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Çıktı */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">.gitignore</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
              {copied ? "Kopyalandı" : "Kopyala"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-1 h-3 w-3" />
              İndir
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm leading-relaxed">
            <code>{content}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
