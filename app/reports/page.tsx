"use client";

import { useState } from "react";
import Card from "@/components/Card";
import RoleGate from "@/components/RoleGate";
import { useScope } from "@/components/ScopeContext";
import ReportTabs, { type ReportTab } from "./_components/ReportTabs";
import RevenueStatCards from "./_components/RevenueStatCards";
import RevenueTrendChart from "./_components/RevenueTrendChart";
import RevenueBreakdown from "./_components/RevenueBreakdown";
import StreamerRevenueRanking from "./_components/StreamerRevenueRanking";
import DailyStatsTable from "./_components/DailyStatsTable";
import ViewerTrendChart from "./_components/ViewerTrendChart";
import BroadcastStatsTable from "./_components/BroadcastStatsTable";
import BroadcastHoursChart from "./_components/BroadcastHoursChart";
import {
  dailyReportsByProject,
  lastMonthRevenueByProject,
  revenueBreakdownByProject,
  streamerReportsByProject,
} from "./_data";

export default function ReportsPage() {
  const { projectId } = useScope();
  const [tab, setTab] = useState<ReportTab>("revenue");

  const dailyData = dailyReportsByProject[projectId] ?? [];
  const revenueSlices = revenueBreakdownByProject[projectId] ?? [];
  const streamerStats = streamerReportsByProject[projectId] ?? [];
  const lastMonthRevenue = lastMonthRevenueByProject[projectId] ?? 0;

  const totalRevenue = revenueSlices.reduce((sum, s) => sum + s.amount, 0);
  const deltaPct = lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : null;
  const totalDonationCount = streamerStats.reduce((sum, s) => sum + s.donationCount, 0);
  const totalBroadcastHours = streamerStats.reduce((sum, s) => sum + s.broadcastHours, 0);
  const avgViewers =
    dailyData.length > 0 ? Math.round(dailyData.reduce((sum, d) => sum + d.viewers, 0) / dailyData.length) : 0;

  return (
    <RoleGate allow={["management"]}>
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">리포트</h1>
              <p className="text-sm text-slate-400">
                수익, 시청자, 방송시간 등의 데이터를 기반으로 한 종합 리포트입니다. (최근 14일, 9월 2일~15일 기준)
              </p>
            </div>
            <ReportTabs active={tab} onChange={setTab} />
          </div>
        </Card>

        <Card>
          <RevenueStatCards
            totalRevenue={totalRevenue}
            deltaPct={deltaPct}
            totalDonationCount={totalDonationCount}
            avgViewers={avgViewers}
            totalBroadcastHours={totalBroadcastHours}
          />
        </Card>

        {tab === "revenue" && (
          <>
            <Card>
              <RevenueTrendChart data={dailyData} />
            </Card>
            <div className="flex flex-col gap-5 lg:flex-row">
              <Card width={1}>
                <RevenueBreakdown slices={revenueSlices} />
              </Card>
              <Card width={2}>
                <StreamerRevenueRanking stats={streamerStats} />
              </Card>
            </div>
          </>
        )}

        {tab === "daily" && (
          <>
            <Card>
              <ViewerTrendChart data={dailyData} />
            </Card>
            <Card>
              <DailyStatsTable data={dailyData} />
            </Card>
          </>
        )}

        {tab === "broadcast" && (
          <>
            <Card>
              <BroadcastHoursChart stats={streamerStats} />
            </Card>
            <Card>
              <BroadcastStatsTable stats={streamerStats} />
            </Card>
          </>
        )}
      </main>
    </RoleGate>
  );
}
