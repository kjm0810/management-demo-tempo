"use client";

import { useMemo } from "react";
import Card from "@/components/Card";
import RoleGate from "@/components/RoleGate";
import { useOrg } from "@/components/OrgContext";
import { useScope } from "@/components/ScopeContext";
import { adminsForProject, streamersInProject } from "@/components/orgData";
import { scheduleByDate, type ScheduleEvent } from "@/app/calendar/_data";
import { initialNotices } from "@/app/notices/_data";
import StatCards from "./_components/StatCards";
import DonationRanking from "./_components/DonationRanking";
import UpcomingSchedule from "./_components/UpcomingSchedule";
import RecentNotices from "./_components/RecentNotices";
import ProjectInfoCard from "./_components/ProjectInfoCard";
import PlatformBreakdown from "./_components/PlatformBreakdown";
import QuickLinks from "./_components/QuickLinks";
import { donationsThisMonth, donationsLastMonth } from "./_data";

export default function ManagementPage() {
  const { companies, projects, streamers, memberships, admins, adminMemberships } = useOrg();
  const { companyId, projectId } = useScope();

  const activeCompany = companies.find((c) => c.id === companyId);
  const activeProject = projects.find((p) => p.id === projectId);
  const projectAdmins = adminsForProject(projectId, admins, adminMemberships);
  const scopedStreamers = streamersInProject(projectId, streamers, memberships);

  const scopedDonations = useMemo(
    () => donationsThisMonth.filter((d) => d.companyId === companyId && d.projectId === projectId),
    [companyId, projectId]
  );

  const scopedDonationsLastMonth = useMemo(
    () => donationsLastMonth.filter((d) => d.companyId === companyId && d.projectId === projectId),
    [companyId, projectId]
  );

  const totalDonation = scopedDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonationLastMonth = scopedDonationsLastMonth.reduce((sum, d) => sum + d.amount, 0);
  const donationDeltaPct =
    totalDonationLastMonth > 0 ? ((totalDonation - totalDonationLastMonth) / totalDonationLastMonth) * 100 : null;

  const scopedScheduleEntries = useMemo(() => {
    const entries: { dateKey: string; event: ScheduleEvent }[] = [];
    for (const [dateKey, events] of Object.entries(scheduleByDate)) {
      for (const event of events) {
        if (event.companyId === companyId && event.projectId === projectId) {
          entries.push({ dateKey, event });
        }
      }
    }
    entries.sort((a, b) => (a.dateKey === b.dateKey ? a.event.startHour - b.event.startHour : a.dateKey < b.dateKey ? -1 : 1));
    return entries;
  }, [companyId, projectId]);

  const scopedNotices = useMemo(
    () =>
      initialNotices
        .filter((n) => n.companyId === companyId && (n.projectId === "" || n.projectId === projectId))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, 3),
    [companyId, projectId]
  );

  return (
    <RoleGate allow={["management"]}>
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
        {activeCompany && activeProject && (
          <Card>
            <ProjectInfoCard
              companyName={activeCompany.name}
              projectName={activeProject.name}
              adminNames={projectAdmins.map((a) => a.name)}
            />
          </Card>
        )}

        <Card>
          <QuickLinks />
        </Card>

        <Card>
          <StatCards
            streamerCount={scopedStreamers.length}
            adminCount={projectAdmins.length}
            totalDonation={totalDonation}
            donationDeltaPct={donationDeltaPct}
            broadcastCount={scopedScheduleEntries.length}
          />
        </Card>

        <div className="flex flex-col gap-5 lg:flex-row">
          <Card width={2}>
            <DonationRanking donations={scopedDonations} />
          </Card>
          <Card width={1}>
            <PlatformBreakdown streamers={scopedStreamers} />
          </Card>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <Card width={1}>
            <UpcomingSchedule items={scopedScheduleEntries.slice(0, 5)} />
          </Card>
          <Card width={1}>
            <RecentNotices notices={scopedNotices} />
          </Card>
        </div>
      </main>
    </RoleGate>
  );
}
