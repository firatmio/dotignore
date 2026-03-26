"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Key, BarChart3, FileCode2, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";

interface DashboardOverviewProps {
  userEmail: string;
  plan: string;
  keyCount: number;
  usageCount: number;
  recentUsage: Array<{
    id: string;
    endpoint: string;
    created_at: string;
  }>;
}

export function DashboardOverviewContent({
  userEmail,
  plan,
  keyCount,
  usageCount,
  recentUsage,
}: DashboardOverviewProps) {
  const { t, locale } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.overview.title}</h1>
          <p className="text-muted-foreground text-sm">
            {t.dashboard.overview.greeting} {userEmail.split("@")[0]}
          </p>
        </div>
        <Badge
          variant={plan === "pro" ? "default" : "secondary"}
          className="text-xs"
        >
          {plan === "pro" ? t.common.proPlan : t.common.freePlan}
        </Badge>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.overview.apiKeys}</CardTitle>
            <Key className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyCount}</div>
            <p className="text-muted-foreground text-xs">{t.dashboard.overview.activeKeys}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.overview.totalRequests}</CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageCount}</div>
            <p className="text-muted-foreground text-xs">{t.dashboard.overview.apiCalls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.overview.plan}</CardTitle>
            <Sparkles className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{plan ?? "free"}</div>
            <p className="text-muted-foreground text-xs">
              {plan === "pro" ? t.dashboard.overview.unlimitedAi : t.dashboard.overview.dailyRequests}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.overview.templates}</CardTitle>
            <FileCode2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18+</div>
            <p className="text-muted-foreground text-xs">{t.dashboard.overview.readyTemplates}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.dashboard.overview.quickAccess}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/generator">
              <Button variant="outline" className="w-full justify-start">
                <FileCode2 className="mr-2 h-4 w-4" />
                {t.dashboard.overview.createGitignore}
              </Button>
            </Link>
            <Link href="/dashboard/api-keys">
              <Button variant="outline" className="w-full justify-start">
                <Key className="mr-2 h-4 w-4" />
                {t.dashboard.overview.createApiKey}
              </Button>
            </Link>
            <Link href="/dashboard/docs">
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="mr-2 h-4 w-4" />
                {t.dashboard.overview.apiDocs}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.dashboard.overview.recentActivity}</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentUsage || recentUsage.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {t.dashboard.overview.noActivity}
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsage.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-2 w-2 rounded-full" />
                      <code className="text-muted-foreground text-xs">
                        {log.endpoint}
                      </code>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(log.created_at).toLocaleDateString(
                        locale === "tr" ? "tr-TR" : "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
