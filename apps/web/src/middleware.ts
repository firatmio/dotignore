import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Şu path'ler HARİÇ tüm route'larda çalış:
     * - _next/static (static dosyalar)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public klasörü
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
