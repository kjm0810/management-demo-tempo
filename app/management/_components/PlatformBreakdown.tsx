import { type Platform, type Streamer, platformMeta } from '@/components/orgData';

type PlatformBreakdownProps = {
  streamers: Streamer[];
};

const PLATFORM_ORDER: Platform[] = ['soop', 'chzzk', 'youtube'];

export default function PlatformBreakdown({ streamers }: PlatformBreakdownProps) {
  const counts = PLATFORM_ORDER.map((platform) => ({
    platform,
    count: streamers.filter((streamer) => streamer.platformAccounts.some((account) => account.platform === platform))
      .length
  })).filter((item) => item.count > 0);

  const totalConnections = counts.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <h3 className='text-sm font-semibold text-white'>플랫폼 분포</h3>

      {totalConnections === 0 ? (
        <p className='text-xs text-slate-600'>이 프로젝트에 연결된 플랫폼이 없습니다.</p>
      ) : (
        <>
          <div className='flex h-2.5 overflow-hidden rounded-full bg-black/30'>
            {counts.map((item) => (
              <div
                key={item.platform}
                className={platformMeta[item.platform].color}
                style={{ width: `${(item.count / totalConnections) * 100}%` }}
              />
            ))}
          </div>

          <div className='flex flex-col gap-2'>
            {counts.map((item) => (
              <div key={item.platform} className='flex items-center gap-2 text-xs'>
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${platformMeta[item.platform].color}`} />
                <span className='text-slate-300'>{platformMeta[item.platform].label}</span>
                <span className='ml-auto text-slate-500'>
                  {item.count}명 · {((item.count / totalConnections) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
