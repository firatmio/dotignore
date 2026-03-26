import { createAdminClient } from "@/lib/supabase/admin";

interface ApiKeyRow {
  id: string;
  user_id: string;
  hashed_key: string;
  key_prefix: string;
  label: string;
  usage_count: number;
  usage_limit: number | null;
  last_used_at: string | null;
  created_at: string;
}

type AuthResult =
  | { valid: true; apiKey: ApiKeyRow; error?: never; status?: never }
  | { valid: false; error: string; status: number; apiKey?: never };

export async function verifyApiKey(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false, error: "API anahtarı gerekli. Authorization: Bearer dk_xxx", status: 401 };
  }

  const rawKey = authHeader.slice(7);
  if (!rawKey.startsWith("dk_")) {
    return { valid: false, error: "Geçersiz API anahtarı formatı", status: 401 };
  }

  // SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedKey = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const supabase = createAdminClient();
  const { data: apiKey, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("hashed_key", hashedKey)
    .single();

  if (error || !apiKey) {
    return { valid: false, error: "Geçersiz API anahtarı", status: 401 };
  }

  // Kullanım limiti kontrolü
  if (apiKey.usage_limit !== null && apiKey.usage_count >= apiKey.usage_limit) {
    return { valid: false, error: "API anahtarı kullanım limitine ulaştı", status: 429 };
  }

  return { valid: true, apiKey: apiKey as ApiKeyRow };
}
