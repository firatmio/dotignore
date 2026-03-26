import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = formData.get("content");

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  return new Response(content, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=\".gitignore\"; filename*=UTF-8''.gitignore",
    },
  });
}
