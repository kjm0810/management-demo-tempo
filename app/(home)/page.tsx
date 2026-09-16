'use client';

import Card from '@/components/Card';
import { useRole } from '@/components/RoleContext';
import StatCard from './_components/StatCard';
import LiveMonitoring from './_components/LiveMonitoring';
import RevenueTrendChart from './_components/RevenueTrendChart';
import RevenueDistribution from './_components/RevenueDistribution';
import ViewerChart from './_components/ViewerChart';
import StreamerTable from './_components/StreamerTable';
import BroadcastSchedule from './_components/BroadcastSchedule';
import { UserIcon, DollarIcon, ActivityIcon, GiftIcon } from '@/components/icons';

export default function Home() {
  const { role } = useRole();

  if (role === 'streamer') {
    return (
      <main className='flex flex-1 flex-col gap-5 overflow-y-auto p-6'>
        <div className='flex flex-col gap-5 xl:flex-row'>
          <Card>
            <StatCard
              icon={DollarIcon}
              iconBg='bg-blue-600'
              label='오늘 내 수익'
              value='3,850,000'
              sub='전일 대비 ▲ 5.2%'
              lineColor='#60a5fa'
              points={[3, 5, 4, 7, 6, 9, 8, 11]}
            />
          </Card>
          <Card>
            <StatCard
              icon={ActivityIcon}
              iconBg='bg-teal-600'
              label='내 시청자 수'
              value='1,234'
              sub='전일 대비 ▲ 8.3%'
              lineColor='#2dd4bf'
              points={[5, 4, 6, 5, 8, 7, 9, 8]}
            />
          </Card>
          <Card>
            <StatCard
              icon={UserIcon}
              iconBg='bg-violet-600'
              label='오늘 방송 시간'
              value='3h 25m'
              sub='시작 14:02'
              deltaColor='text-slate-400'
              lineColor='#8b5cf6'
              points={[4, 6, 5, 8, 6, 9, 7, 10]}
            />
          </Card>
          <Card>
            <StatCard
              icon={GiftIcon}
              iconBg='bg-orange-600'
              label='오늘 후원 수'
              value='312'
              sub='전일 대비 ▲ 4.1%'
              lineColor='#fb923c'
              points={[3, 4, 3, 6, 5, 7, 6, 9]}
            />
          </Card>
        </div>

        <div className='flex flex-col gap-5 lg:flex-row'>
          <Card width={1.4}>
            <RevenueTrendChart />
          </Card>
          <Card>
            <ViewerChart />
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className='flex flex-1 flex-col gap-5 overflow-y-auto p-6'>
      <div className='flex flex-col gap-5 xl:flex-row'>
        <Card>
          <StatCard
            icon={UserIcon}
            iconBg='bg-violet-600'
            label='전체 스트리머'
            value='18'
            sub='온라인 12명'
            deltaColor='text-slate-400'
            lineColor='#8b5cf6'
            points={[4, 6, 5, 8, 6, 9, 7, 10]}
          />
        </Card>
        <Card>
          <StatCard
            icon={DollarIcon}
            iconBg='bg-blue-600'
            label='오늘 총 수익'
            value='24,850,000'
            sub='전일 대비 ▲ 12.5%'
            lineColor='#60a5fa'
            points={[3, 5, 4, 7, 6, 9, 8, 11]}
          />
        </Card>
        <Card>
          <StatCard
            icon={ActivityIcon}
            iconBg='bg-teal-600'
            label='시청자 총합'
            value='98,765'
            sub='전일 대비 ▲ 8.3%'
            lineColor='#2dd4bf'
            points={[5, 4, 6, 5, 8, 7, 9, 8]}
          />
        </Card>
        <Card>
          <StatCard
            icon={GiftIcon}
            iconBg='bg-orange-600'
            label='총 후원 수'
            value='5,214'
            sub='전일 대비 ▲ 15.7%'
            lineColor='#fb923c'
            points={[3, 4, 3, 6, 5, 7, 6, 9]}
          />
        </Card>
        <Card width='420px'>
          <LiveMonitoring />
        </Card>
      </div>

      <div className='flex flex-col gap-5 lg:flex-row'>
        <Card width={1.4}>
          <RevenueTrendChart />
        </Card>
        <Card width='300px'>
          <RevenueDistribution />
        </Card>
        <Card>
          <ViewerChart />
        </Card>
      </div>

      <div className='flex flex-col gap-5 xl:flex-row'>
        <Card>
          <StreamerTable />
        </Card>
        <Card>
          <BroadcastSchedule />
        </Card>
      </div>
    </main>
  );
}
