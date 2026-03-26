"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/provider";

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  POST: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  DELETE: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function DocsContent() {
  const { t } = useTranslation();

  const endpoints = [
    {
      method: "GET",
      path: "/api/templates",
      description: t.dashboard.docsPage.listTemplates,
      auth: false,
      params: [
        { name: "category", type: "string", desc: t.dashboard.docsPage.paramCategory, optional: true },
        { name: "source", type: "string", desc: t.dashboard.docsPage.paramSource, optional: true },
      ],
      response: `[
  {
    "id": "node",
    "name": "Node.js",
    "category": "language",
    "source": "github",
    "description": "...",
    "rules": ["node_modules/", "dist/", ...]
  }
]`,
    },
    {
      method: "POST",
      path: "/api/generate",
      description: t.dashboard.docsPage.generateFree,
      auth: false,
      params: [
        { name: "templates", type: "string[]", desc: t.dashboard.docsPage.paramTemplateIds, optional: false },
      ],
      response: `{
  "content": "# Node.js\\nnode_modules/\\n...",
  "conflicts": [],
  "source": "github"
}`,
    },
    {
      method: "POST",
      path: "/api/generate/ai",
      description: t.dashboard.docsPage.generateAi,
      auth: true,
      params: [
        { name: "templates", type: "string[]", desc: t.dashboard.docsPage.paramTemplateIds, optional: false },
        { name: "projectDescription", type: "string", desc: t.dashboard.docsPage.paramDescription, optional: true },
      ],
      response: `{
  "content": "# Node.js\\nnode_modules/\\n...",
  "conflicts": [],
  "source": "custom",
  "aiSuggestions": [
    { "rule": ".env.production", "reason": "Production env file..." }
  ]
}`,
    },
    {
      method: "GET",
      path: "/api/keys",
      description: t.dashboard.docsPage.listKeys,
      auth: true,
      params: [],
      response: `[
  {
    "id": "uuid",
    "key_prefix": "dk_abc1",
    "label": "Default",
    "usage_count": 42,
    "usage_limit": null,
    "created_at": "2026-01-01T00:00:00Z"
  }
]`,
    },
    {
      method: "POST",
      path: "/api/keys",
      description: t.dashboard.docsPage.createKey,
      auth: true,
      params: [
        { name: "label", type: "string", desc: t.dashboard.docsPage.paramLabel, optional: true },
      ],
      response: `{
  "rawKey": "dk_abc123...",
  "apiKey": { "id": "uuid", "key_prefix": "dk_abc1", ... }
}`,
    },
    {
      method: "DELETE",
      path: "/api/keys/:id",
      description: t.dashboard.docsPage.deleteKey,
      auth: true,
      params: [],
      response: `{ "success": true }`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t.dashboard.docsPage.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t.dashboard.docsPage.description}
        </p>
      </div>

      {/* Quick start */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.dashboard.docsPage.quickStart}</CardTitle>
          <CardDescription>
            {t.dashboard.docsPage.quickStartDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t.dashboard.docsPage.step1}</p>
            <p className="text-muted-foreground text-sm">
              {t.dashboard.docsPage.step1Desc}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t.dashboard.docsPage.step2}</p>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`curl -X POST https://dotignore.dev/api/generate/ai \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"templates": ["node", "nextjs"], "projectDescription": "Next.js SaaS"}'`}</code>
            </pre>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t.dashboard.docsPage.step3}</p>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`${t.dashboard.docsPage.cliCmd1}
${t.dashboard.docsPage.cliCmd2}
${t.dashboard.docsPage.cliCmd3}`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.dashboard.docsPage.authentication}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {t.dashboard.docsPage.authDesc1}
          </p>
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
            <code>Authorization: Bearer dk_your_api_key_here</code>
          </pre>
          <p className="text-muted-foreground">
            {t.dashboard.docsPage.authDesc2}
          </p>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t.dashboard.docsPage.endpoints}</h2>
        {endpoints.map((ep, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className={`font-mono text-xs ${methodColors[ep.method]}`}
                >
                  {ep.method}
                </Badge>
                <code className="text-sm font-medium">{ep.path}</code>
                {ep.auth && (
                  <Badge variant="outline" className="text-xs">
                    🔑 Auth
                  </Badge>
                )}
              </div>
              <CardDescription>{ep.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ep.params.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t.dashboard.docsPage.parameters}</p>
                  <div className="bg-muted rounded-lg p-3">
                    {ep.params.map((p) => (
                      <div
                        key={p.name}
                        className="flex items-start gap-2 py-1.5 text-sm"
                      >
                        <code className="text-primary font-medium">
                          {p.name}
                        </code>
                        <Badge variant="outline" className="text-[10px]">
                          {p.type}
                        </Badge>
                        {p.optional && (
                          <Badge variant="secondary" className="text-[10px]">
                            {t.common.optional}
                          </Badge>
                        )}
                        <span className="text-muted-foreground">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">{t.dashboard.docsPage.response}</p>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                  <code>{ep.response}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rate limits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.dashboard.docsPage.rateLimiting}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">{t.common.freePlan}</p>
              <p className="text-muted-foreground text-sm">
                {t.dashboard.docsPage.freePlanRate}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">{t.common.proPlan}</p>
              <p className="text-muted-foreground text-sm">
                {t.dashboard.docsPage.proPlanRate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
