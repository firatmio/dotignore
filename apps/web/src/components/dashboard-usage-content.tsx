"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/i18n/provider";

interface UsageContentProps {
  plan: string;
  totalRequests: number;
  todayRequests: number;
  weekLogs: Array<{ created_at: string; endpoint: string }>;
  apiKeys: Array<{
    id: string;
    key_prefix: string;
    label: string;
    usage_count: number;
    usage_limit: number | null;
    last_used_at: string | null;
  }>;
}

export function UsageContent({
  plan,
  totalRequests,
  todayRequests,
  weekLogs,
  apiKeys,
}: UsageContentProps) {
  const { t, locale } = useTranslation();

  // Daily distribution
  const dailyMap = new Map<string, number>();
  const dayLabels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
    dayLabels.push(
      d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
        weekday: "short",
        day: "numeric",
      })
    );
  }
  weekLogs?.forEach((log) => {
    const key = log.created_at.slice(0, 10);
    if (dailyMap.has(key)) {
      dailyMap.set(key, dailyMap.get(key)! + 1);
    }
  });
  const dailyValues = Array.from(dailyMap.values());
  const maxDaily = Math.max(...dailyValues, 1);

  // Endpoint distribution
  const endpointMap = new Map<string, number>();
  weekLogs?.forEach((log) => {
    endpointMap.set(log.endpoint, (endpointMap.get(log.endpoint) ?? 0) + 1);
  });
  const endpoints = Array.from(endpointMap.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  const dailyLimit = plan === "pro" ? Infinity : 20;
  const usagePercent =
    dailyLimit === Infinity
      ? 0
      : Math.min(100, (todayRequests / dailyLimit) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.usagePage.title}</h1>
        <p className="text-muted-foreground text-sm">
          {t.dashboard.usagePage.description}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.usagePage.today}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRequests}</div>
            {plan !== "pro" && (
              <div className="mt-2 space-y-1">
                <Progress value={usagePercent} className="h-2" />
                <p className="text-muted-foreground text-xs">
                  {todayRequests} / {dailyLimit} {t.dashboard.usagePage.dailyLimit}
                </p>
              </div>
            )}
            {plan === "pro" && (
              <p className="text-muted-foreground text-xs">{t.dashboard.usagePage.unlimited}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.usagePage.thisWeek}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekLogs?.length ?? 0}</div>
            <p className="text-muted-foreground text-xs">{t.dashboard.usagePage.last7Days}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.usagePage.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-muted-foreground text-xs">{t.dashboard.usagePage.allTime}</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.dashboard.usagePage.weeklyUsage}</CardTitle>
          <CardDescription>{t.dashboard.usagePage.weeklyUsageDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2">
            {dailyValues.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-muted-foreground text-xs">{val}</span>
                <div
                  className="bg-primary w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(4, (val / maxDaily) * 120)}px`,
                  }}
                />
                <span className="text-muted-foreground text-[10px]">
                  {dayLabels[i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Endpoint distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.dashboard.usagePage.endpointDist}</CardTitle>
            <CardDescription>{t.dashboard.usagePage.last7Days}</CardDescription>
          </CardHeader>
          <CardContent>
            {endpoints.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {t.common.noDataYet}
              </p>
            ) : (
              <div className="space-y-3">
                {endpoints.map(([endpoint, count]) => (
                  <div key={endpoint} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-xs">{endpoint}</code>
                      <span className="text-muted-foreground text-xs">
                        {count} {t.common.request}
                      </span>
                    </div>
                    <Progress
                      value={(count / (weekLogs?.length ?? 1)) * 100}
                      className="h-1.5"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.dashboard.usagePage.keyUsage}</CardTitle>
            <CardDescription>{t.dashboard.usagePage.perApiKey}</CardDescription>
          </CardHeader>
          <CardContent>
            {!apiKeys || apiKeys.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {t.dashboard.usagePage.noApiKeys}
              </p>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{k.label}</p>
                      <code className="text-muted-foreground text-xs">
                        {k.key_prefix}...
                      </code>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {k.usage_count}
                        {k.usage_limit && (
                          <span className="text-muted-foreground">
                            {" "}
                            / {k.usage_limit}
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {k.last_used_at
                          ? new Date(k.last_used_at).toLocaleDateString(
                              locale === "tr" ? "tr-TR" : "en-US"
                            )
                          : t.dashboard.usagePage.neverUsed}
                      </p>
                    </div>
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
