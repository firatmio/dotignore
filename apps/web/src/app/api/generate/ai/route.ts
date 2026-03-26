import { NextResponse } from "next/server";
import { z } from "zod";
import { mergeTemplates } from "@dotignore/templates";
import { detectConflicts } from "@dotignore/shared";
import type { AiSuggestion } from "@dotignore/shared";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyApiKey } from "@/lib/api-key-auth";

const generateAiSchema = z.object({
  templates: z.array(z.string()).min(1, "En az 1 şablon seçmelisiniz"),
  projectDescription: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // API Key doğrulama
    const authResult = await verifyApiKey(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const body = await request.json();
    const parsed = generateAiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Geçersiz istek" },
        { status: 400 },
      );
    }

    // Şablonları birleştir
    const { content, rules } = mergeTemplates(parsed.data.templates);

    if (rules.length === 0) {
      return NextResponse.json(
        { error: "Seçilen şablonlar bulunamadı" },
        { status: 404 },
      );
    }

    // Claude AI çağrısı
    const aiSuggestions = await getAiSuggestions(rules, parsed.data.projectDescription);

    // AI önerilerini mevcut kurallara ekle
    const aiRulesBlock = aiSuggestions.length > 0
      ? "\n# === AI Önerileri ===\n" + aiSuggestions.map((s) => s.rule).join("\n") + "\n"
      : "";
    const fullContent = content.trimEnd() + aiRulesBlock;

    // Çakışma tespiti (AI önerileri dahil)
    const conflicts = detectConflicts(fullContent);

    // Usage güncelle
    const supabase = createAdminClient();
    const updateData: { usage_count: number; last_used_at: string } = {
      usage_count: authResult.apiKey!.usage_count + 1,
      last_used_at: new Date().toISOString(),
    };
    await supabase
      .from("api_keys")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", authResult.apiKey!.id);

    return NextResponse.json({
      content: fullContent,
      conflicts,
      aiSuggestions,
      templateCount: parsed.data.templates.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 },
    );
  }
}

async function getAiSuggestions(
  currentRules: string[],
  projectDescription?: string,
): Promise<AiSuggestion[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-20250414",
        max_tokens: 1024,
        system:
          "Sen bir .gitignore uzmanısın. Kullanıcının mevcut gitignore kurallarına bakarak EKSİK olan önemli kuralları öner. Her öneri için kural ve kısa bir sebep ver. Yanıtını SADECE JSON dizisi olarak ver, başka hiçbir şey yazma. Format: [{\"rule\": \"pattern\", \"reason\": \"neden\"}]. En fazla 5 öneri ver.",
        messages: [
          {
            role: "user",
            content: `Mevcut .gitignore kurallarım:\n${currentRules.join("\n")}${projectDescription ? `\n\nProje açıklaması: ${projectDescription}` : ""}\n\nEksik olan önemli kuralları öner.`,
          },
        ],
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "[]";

    // JSON parse — AI bazen markdown code block ile sarar
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const suggestions = JSON.parse(cleaned) as AiSuggestion[];

    return Array.isArray(suggestions) ? suggestions.slice(0, 5) : [];
  } catch {
    return [];
  }
}
