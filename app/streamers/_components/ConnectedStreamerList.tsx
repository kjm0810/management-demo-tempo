import { type Project, type Streamer, platformMeta } from '@/components/orgData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ConnectedStreamerListProps = {
  streamers: Streamer[];
  projectsByStreamer: Record<string, Project[]>;
  showProjects: boolean;
  onRemoveFromProject: (streamerId: string, projectId: string) => void;
};

export default function ConnectedStreamerList({
  streamers,
  projectsByStreamer,
  showProjects,
  onRemoveFromProject
}: ConnectedStreamerListProps) {
  if (streamers.length === 0) {
    return <p className='text-sm text-slate-500'>연결된 스트리머가 없습니다. 프로젝트에서 스트리머를 초대해보세요.</p>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-180 border-collapse text-left text-sm'>
        <thead>
          <tr className='text-xs text-slate-500'>
            <th className='pb-3 font-medium'>이름</th>
            <th className='pb-3 font-medium'>연결 플랫폼</th>
            {showProjects && <th className='pb-3 font-medium'>참여 프로젝트</th>}
            <th className='pb-3 font-medium'>연결일</th>
          </tr>
        </thead>

        <tbody>
          {streamers.map((streamer) => {
            const streamerProjects = projectsByStreamer[streamer.id] ?? [];

            return (
              <tr key={streamer.id} className='border-t border-white/5'>
                <td className='py-3'>
                  <div className='flex items-center gap-2.5'>
                    <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white'>
                      {streamer.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className='text-slate-200'>{streamer.name}</span>
                  </div>
                </td>

                <td className='py-3'>
                  {streamer.platformAccounts.length === 0 ? (
                    <span className='text-xs text-slate-500'>연결된 플랫폼 없음</span>
                  ) : (
                    <div className='flex flex-col gap-1.5'>
                      {streamer.platformAccounts.map((account) => (
                        <div key={account.platform} className='flex items-center gap-2'>
                          <Badge className={`text-white ${platformMeta[account.platform].color}`}>
                            {platformMeta[account.platform].label}
                          </Badge>
                          <span className='text-xs text-slate-400'>{account.handle}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                {showProjects && (
                  <td className='py-3'>
                    {streamerProjects.length === 0 ? (
                      <span className='text-xs text-slate-500'>참여 프로젝트 없음</span>
                    ) : (
                      <div className='flex max-w-80 flex-wrap gap-2'>
                        {streamerProjects.map((project) => (
                          <div key={project.id} className='flex items-center gap-1'>
                            <Badge variant='outline' className='text-slate-300'>
                              {project.name}
                            </Badge>

                            <AlertDialog>
                              <AlertDialogTrigger
                                render={
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    className='h-6 px-2 text-xs text-slate-500 hover:text-red-400'
                                  />
                                }>
                                제외
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>프로젝트에서 제외하시겠습니까?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {streamer.name}님을 {project.name} 프로젝트에서 제외합니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => onRemoveFromProject(streamer.id, project.id)}>
                                    제외
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                )}

                <td className='py-3 text-slate-300'>{streamer.connectedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
