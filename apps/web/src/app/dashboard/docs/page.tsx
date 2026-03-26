import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const endpoints = [
  {
    method: "GET",
    path: "/api/templates",
    description: "Tüm şablonları listeler",
    auth: false,
    params: [
      { name: "category", type: "string", desc: "Kategori filtresi (language, framework, os, ide)", optional: true },
      { name: "source", type: "string", desc: "Kaynak filtresi (github, custom)", optional: true },
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
    description: "Şablonlardan .gitignore oluşturur (ücretsiz, günlük 20 istek)",
    auth: false,
    params: [
      { name: "templates", type: "string[]", desc: "Şablon ID listesi", optional: false },
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
    description: "AI destekli .gitignore oluşturur (API key gerekli)",
    auth: true,
    params: [
      { name: "templates", type: "string[]", desc: "Şablon ID listesi", optional: false },
      { name: "projectDescription", type: "string", desc: "Proje açıklaması (AI için)", optional: true },
    ],
    response: `{
  "content": "# Node.js\\nnode_modules/\\n...",
  "conflicts": [],
  "source": "custom",
  "aiSuggestions": [
    { "rule": ".env.production", "reason": "Production env dosyası..." }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/keys",
    description: "API anahtarlarınızı listeler",
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
    description: "Yeni API anahtarı oluşturur",
    auth: true,
    params: [
      { name: "label", type: "string", desc: "Anahtar etiketi", optional: true },
    ],
    response: `{
  "rawKey": "dk_abc123...",
  "apiKey": { "id": "uuid", "key_prefix": "dk_abc1", ... }
}`,
  },
  {
    method: "DELETE",
    path: "/api/keys/:id",
    description: "API anahtarını siler",
    auth: true,
    params: [],
    response: `{ "success": true }`,
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  POST: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  DELETE: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          API Dokümantasyonu
        </h1>
        <p className="text-muted-foreground text-sm">
          dotignore REST API referansı
        </p>
      </div>

      {/* Quick start */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hızlı Başlangıç</CardTitle>
          <CardDescription>
            API&apos;yi kullanmaya başlamak için
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. API anahtarı oluşturun</p>
            <p className="text-muted-foreground text-sm">
              Dashboard &gt; API Anahtarları sayfasından yeni bir anahtar oluşturun.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">2. İstek gönderin</p>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`curl -X POST https://dotignore.dev/api/generate/ai \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"templates": ["node", "nextjs"], "projectDescription": "Next.js SaaS"}'`}</code>
            </pre>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">3. CLI kullanımı</p>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code>{`npx dotignore init          # İnteraktif oluşturucu
npx dotignore ai --key ...  # AI destekli
npx dotignore check         # Çakışma kontrolü`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kimlik Doğrulama</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            AI endpoint&apos;i ve API key yönetimi için{" "}
            <code className="bg-muted rounded px-1.5 py-0.5">Authorization</code>{" "}
            header&apos;ı gereklidir:
          </p>
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
            <code>Authorization: Bearer dk_your_api_key_here</code>
          </pre>
          <p className="text-muted-foreground">
            <code className="bg-muted rounded px-1.5 py-0.5">/api/templates</code> ve{" "}
            <code className="bg-muted rounded px-1.5 py-0.5">/api/generate</code>{" "}
            endpoint&apos;leri API key gerektirmez (rate limit uygulanır).
          </p>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Endpoint&apos;ler</h2>
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
                  <p className="text-sm font-medium">Parametreler</p>
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
                            opsiyonel
                          </Badge>
                        )}
                        <span className="text-muted-foreground">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">Yanıt</p>
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
          <CardTitle className="text-base">Rate Limiting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-muted-foreground text-sm">
                Günlük 20 istek (IP bazlı)
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Pro Plan</p>
              <p className="text-muted-foreground text-sm">
                Sınırsız AI erişimi (API key bazlı limit opsiyonel)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
