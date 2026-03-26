import { NextResponse } from "next/server";
import { z } from "zod";
import { mergeTemplates } from "@dotignore/templates";
import { detectConflicts } from "@dotignore/shared";
import { createAdminClient } from "@/lib/supabase/admin";

const generateSchema = z.object({
  templates: z.array(z.string()).min(1, "En az 1 şablon seçmelisiniz"),
});

const DAILY_LIMIT = 20;

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createAdminClient();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .eq("endpoint", "/api/generate")
    .gte("created_at", oneDayAgo);

  const used = count ?? 0;
  return { allowed: used < DAILY_LIMIT, remaining: Math.max(0, DAILY_LIMIT - used) };
}

async function logUsage(ip: string) {
  const supabase = createAdminClient();
  await supabase.from("usage_logs").insert({
    ip_address: ip,
    endpoint: "/api/generate",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Geçersiz istek" },
        { status: 400 },
      );
    }

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, remaining } = await checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Günlük ücretsiz kullanım limitine ulaştınız. Pro'ya yükseltin." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(DAILY_LIMIT),
            "X-RateLimit-Remaining": "0",
            "Retry-After": "86400",
          },
        },
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

    // Çakışma tespiti
    const conflicts = detectConflicts(content);

    // Kullanımı logla
    await logUsage(ip);

    return NextResponse.json(
      { content, conflicts, templateCount: parsed.data.templates.length },
      {
        headers: {
          "X-RateLimit-Limit": String(DAILY_LIMIT),
          "X-RateLimit-Remaining": String(remaining - 1),
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 },
    );
  }
}
