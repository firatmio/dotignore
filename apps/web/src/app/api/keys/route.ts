import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const createKeySchema = z.object({
  label: z.string().min(1).max(50).default("Default"),
});

// GET — kullanıcının API key'lerini listele
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const { data: keys } = await supabase
    .from("api_keys")
    .select("id, key_prefix, label, usage_count, usage_limit, last_used_at, created_at")
    .order("created_at", { ascending: false });

  return NextResponse.json(keys ?? []);
}

// POST — yeni API key oluştur
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createKeySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Geçersiz istek" },
      { status: 400 },
    );
  }

  // 32 byte random key oluştur (dk_ prefix)
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const hex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const rawKey = `dk_${hex}`;
  const keyPrefix = rawKey.slice(0, 11); // "dk_abc12345"

  // SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedKey = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  // DB'ye kaydet (admin client — RLS bypass gerekmiyor aslında ama consistent olsun)
  const adminSupabase = createAdminClient();
  const { data: apiKey, error } = await adminSupabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      hashed_key: hashedKey,
      key_prefix: keyPrefix,
      label: parsed.data.label,
    })
    .select("id, key_prefix, label, usage_count, usage_limit, last_used_at, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "API anahtarı oluşturulamadı" }, { status: 500 });
  }

  // Raw key'i sadece bir kez göster
  return NextResponse.json({ apiKey, rawKey });
}
