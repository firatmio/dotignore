import { NextResponse } from "next/server";
import { getTemplates } from "@dotignore/templates";
import type { TemplateCategory, TemplateSource } from "@dotignore/shared";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as TemplateCategory | null;
  const source = searchParams.get("source") as TemplateSource | null;

  const filter: { category?: TemplateCategory; source?: TemplateSource } = {};
  if (category) filter.category = category;
  if (source) filter.source = source;

  const templates = getTemplates(Object.keys(filter).length > 0 ? filter : undefined);

  return NextResponse.json(templates, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
