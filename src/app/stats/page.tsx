"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  MousePointerClick,
  Layers,
  TrendingUp,
  ExternalLink,
  Loader2,
  RefreshCw,
  Plus,
  Trophy,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAuth } from "../../lib/authContext";
import { useLinksStatsQuery } from "../../lib/useLinks";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/ui/chart";

function getDisplayHost(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function truncateLabel(text: string, maxLength = 10): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

const clicksChartConfig = {
  clickCount: {
    label: "클릭수",
    color: "#3182F6",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 비로그인 시 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // Firestore orderBy('clickCount', 'desc') 기반 통계 쿼리
  const {
    data: links = [],
    isLoading: isStatsLoading,
    isFetching,
    refetch,
  } = useLinksStatsQuery(user?.uid);

  // 모든 링크의 클릭수 합산 및 차트 데이터 계산
  const { totalClicks, avgClicks, maxClicks, chartData } = useMemo(() => {
    const total = links.reduce(
      (acc, link) => acc + (Number(link.clickCount ?? link.click_count) || 0),
      0
    );
    const max = links.reduce(
      (acc, link) => Math.max(acc, Number(link.clickCount ?? link.click_count) || 0),
      0
    );
    const avg = links.length > 0 ? Math.round((total / links.length) * 10) / 10 : 0;

    const data = links.slice(0, 8).map((link) => ({
      name: truncateLabel(link.title || "제목 없음", 9),
      fullTitle: link.title || "제목 없음",
      clickCount: Number(link.clickCount ?? link.click_count) || 0,
    }));

    return { totalClicks: total, avgClicks: avg, maxClicks: max, chartData: data };
  }, [links]);

  // 인증 확인 중이거나 비로그인(리다이렉트 진행 중)일 때는 콘텐츠를 노출하지 않음
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center justify-center px-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#3182F6]" />
          <p className="text-[14px] font-medium text-[#4E5968]">
            {authLoading ? "로그인 상태를 확인하는 중이에요..." : "로그인 페이지로 이동 중이에요..."}
          </p>
        </div>
      </div>
    );
  }

  // 차트 높이를 링크 개수에 맞춰 동적으로 계산 (최소 180px)
  const chartHeight = Math.max(180, chartData.length * 40 + 28);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center pb-16 selection:bg-[#3182F6] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full max-w-[430px] bg-[#F9FAFB]/95 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-[#E5E8EB]/60">
        <Link
          href="/"
          className="flex items-center gap-1 text-[#4E5968] hover:text-[#191F28] transition-colors p-1"
          aria-label="메인 화면으로 돌아가기"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[14px] font-medium">뒤로</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <h1 className="text-[17px] font-bold text-[#191F28] tracking-tight">
            클릭 통계
          </h1>
          <Badge variant="brand" className="text-[10px] px-1.5 py-0">
            Stats
          </Badge>
        </div>

        <Button
          type="button"
          onClick={() => refetch()}
          variant="ghost"
          size="icon"
          disabled={isFetching}
          className="w-8 h-8 rounded-full text-[#4E5968] hover:text-[#191F28] cursor-pointer"
          title="통계 새로고침"
          aria-label="통계 새로고침"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-[#3182F6]" : ""}`} />
        </Button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[430px] px-5 py-5 flex flex-col gap-4">
        {/* 상단: 총 클릭수 요약 카드 (모든 링크 합산) */}
        <Card className="p-6 text-left bg-white border-[#E5E8EB] shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-[#3182F6]">
              <MousePointerClick className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[13px] font-bold">총 클릭수</span>
            </div>
            <span className="text-[11px] font-medium text-[#8B95A1]">
              전체 링크 합산
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-5">
            {isStatsLoading ? (
              <div className="h-10 w-28 rounded-lg bg-[#F2F4F6] animate-pulse" />
            ) : (
              <>
                <span className="text-[36px] leading-none font-extrabold tracking-tight text-[#191F28] tabular-nums">
                  {totalClicks.toLocaleString()}
                </span>
                <span className="text-[16px] font-bold text-[#4E5968]">회</span>
              </>
            )}
          </div>

          {/* 보조 통계 스냅샷 */}
          <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#F2F4F6]">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E8EB]/60">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#4E5968]">
                <Layers className="w-3.5 h-3.5 text-[#3182F6]" />
                <span>전체 링크</span>
              </div>
              <span className="text-[14px] font-bold text-[#191F28] tabular-nums">
                {links.length}개
              </span>
            </div>

            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E8EB]/60">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#4E5968]">
                <TrendingUp className="w-3.5 h-3.5 text-[#2B9D5B]" />
                <span>평균 클릭</span>
              </div>
              <span className="text-[14px] font-bold text-[#191F28] tabular-nums">
                {avgClicks.toLocaleString()}회
              </span>
            </div>
          </div>
        </Card>

        {/* 중단: shadcn/ui BarChart (링크별 클릭수 시각화) */}
        {!isStatsLoading && chartData.length > 0 && (
          <Card className="p-5 flex flex-col gap-3 text-left overflow-visible">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E8EB]/60">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#3182F6]" />
                <h2 className="text-[15px] font-bold text-[#191F28]">클릭수 차트</h2>
              </div>
              <span className="text-[11px] font-medium text-[#8B95A1]">
                상위 {chartData.length}개 링크
              </span>
            </div>

            <div className="w-full" style={{ height: `${chartHeight}px` }}>
              <ChartContainer
                config={clicksChartConfig}
                className="h-full w-full aspect-auto"
              >
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={84}
                    tick={{ fontSize: 11, fill: "#4E5968", fontWeight: 500 }}
                  />
                  <XAxis
                    type="number"
                    domain={[0, (dataMax: number) => Math.max(dataMax, 5)]}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#8B95A1" }}
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(49, 130, 246, 0.08)" }}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_label, payload) => {
                          const first = payload?.[0]?.payload as { fullTitle?: string } | undefined;
                          return first?.fullTitle || _label;
                        }}
                        formatter={(value) => (
                          <div className="flex items-center justify-between gap-3 w-full">
                            <span className="text-[#6B7684]">클릭수</span>
                            <span className="font-mono font-bold tabular-nums text-[#191F28]">
                              {Number(value ?? 0).toLocaleString()}회
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar
                    dataKey="clickCount"
                    fill="var(--color-clickCount, #3182F6)"
                    radius={[0, 8, 8, 0]}
                    barSize={20}
                    minPointSize={4}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </Card>
        )}

        {/* 하단: 링크별 클릭수 (많은 순 정렬) */}
        <Card className="p-5 flex flex-col gap-3.5 text-left">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E8EB]/60">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#3182F6]" />
              <h2 className="text-[15px] font-bold text-[#191F28]">링크별 클릭수</h2>
            </div>
            <span className="text-[11px] font-medium text-[#8B95A1]">
              클릭 많은 순
            </span>
          </div>

          {isStatsLoading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2 text-[#8B95A1]">
              <Loader2 className="w-5 h-5 animate-spin text-[#3182F6]" />
              <p className="text-[12px] font-medium text-[#4E5968]">
                링크 통계를 불러오는 중이에요...
              </p>
            </div>
          ) : links.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {links.map((link, index) => {
                const clicks = Number(link.clickCount ?? link.click_count) || 0;
                const sharePercent =
                  totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
                const barWidthPercent =
                  maxClicks > 0 ? Math.max(4, Math.round((clicks / maxClicks) * 100)) : 0;
                const rank = index + 1;
                const isTopRank = rank === 1 && clicks > 0;

                return (
                  <div
                    key={link.id}
                    className={`p-3.5 rounded-2xl border transition-colors ${
                      isTopRank
                        ? "bg-[#F4F9FF] border-[#3182F6]/30"
                        : "bg-[#F9FAFB]/80 border-[#E5E8EB]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      {/* 순위 + 아이콘 + 제목/도메인 */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tabular-nums ${
                            isTopRank
                              ? "bg-[#3182F6] text-white"
                              : rank <= 3
                                ? "bg-[#E8F3FF] text-[#3182F6]"
                                : "bg-[#E5E8EB] text-[#4E5968]"
                          }`}
                          title={`${rank}위`}
                        >
                          {isTopRank ? <Trophy className="w-3.5 h-3.5" /> : rank}
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-white border border-[#E5E8EB] flex items-center justify-center text-[18px] shrink-0 shadow-2xs">
                          {link.icon || "🔗"}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-bold text-[#191F28] truncate">
                              {link.title}
                            </span>
                            {!link.is_active && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#E5E8EB] text-[#4E5968] shrink-0">
                                숨김
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#8B95A1] truncate">
                            {getDisplayHost(link.url)}
                          </span>
                        </div>
                      </div>

                      {/* 클릭수 + 외부 링크 이동 */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[15px] font-extrabold text-[#191F28] tabular-nums">
                            {clicks.toLocaleString()}회
                          </div>
                          <div className="text-[11px] font-medium text-[#8B95A1] tabular-nums">
                            {sharePercent}%
                          </div>
                        </div>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-white border border-[#E5E8EB] flex items-center justify-center text-[#8B95A1] hover:text-[#3182F6] hover:border-[#3182F6]/40 transition-colors"
                          title="링크 열기"
                          aria-label={`${link.title} 링크 새 탭에서 열기`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* 클릭 비율 프로그레스 바 */}
                    <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#E5E8EB]/70 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isTopRank ? "bg-[#3182F6]" : "bg-[#3182F6]/60"
                        }`}
                        style={{ width: `${barWidthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 px-4 text-center rounded-2xl border border-dashed border-[#E5E8EB] bg-[#F9FAFB]/70 flex flex-col items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#191F28] mb-1">
                  아직 등록된 링크가 없어요
                </p>
                <p className="text-[12px] text-[#8B95A1]">
                  마이페이지에서 링크를 추가하면 링크별 클릭 통계를 확인할 수 있어요.
                </p>
              </div>
              <Link href="/edit" className="mt-1">
                <Button
                  type="button"
                  variant="brandWeak"
                  size="sm"
                  className="rounded-full px-4 h-8.5 text-[12px] font-bold gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>링크 추가하러 가기</span>
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
