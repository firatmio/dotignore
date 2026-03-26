import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE — API key sil
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  // RLS sayesinde sadece kendi key'ini silebilir
  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
