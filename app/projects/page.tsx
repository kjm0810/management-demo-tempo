'use client';

import { useState } from 'react';

import Card from '@/components/Card';
import { useOrg } from '@/components/OrgContext';
import RoleGate from '@/components/RoleGate';
import { useScope } from '@/components/ScopeContext';
import { PlusIcon } from '@/components/icons';
import { type Admin, type Project, adminsInCompany } from '@/components/orgData';
import { Button } from '@/components/ui/button';

import AdminFormModal from './_components/AdminFormModal';
import AdminProjectModal from './_components/AdminProjectModal';
import CompanySection from './_components/CompanySection';
import ProjectAdminModal from './_components/ProjectAdminModal';
import ProjectFormModal from './_components/ProjectFormModal';
import StreamerInviteModal from './_components/StreamerInviteModal';

export default function ProjectsPage() {
  const {
    companies,
    projects,
    streamers,
    memberships,
    admins,
    adminMemberships,
    adminCompanyMemberships,
    projectInvites,
    inviteStreamers,
    addProject,
    removeProject,
    removeCompany,
    addAdmin,
    setAdminProjects,
    setProjectAdmins
  } = useOrg();
  const { companyId } = useScope();

  const myCompany = companies.find((c) => c.id === companyId);
  const companyAdmins = myCompany ? adminsInCompany(myCompany.id, admins, adminCompanyMemberships) : [];
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [managingAdmin, setManagingAdmin] = useState<Admin | null>(null);
  const [managingProjectAdmins, setManagingProjectAdmins] = useState<Project | null>(null);
  const [invitingProject, setInvitingProject] = useState<Project | null>(null);

  const adminProjectIds = new Set(
    adminMemberships.filter((m) => m.adminId === managingAdmin?.id).map((m) => m.projectId)
  );

  const projectAdminIds = new Set(
    adminMemberships.filter((m) => m.projectId === managingProjectAdmins?.id).map((m) => m.adminId)
  );

  return (
    <RoleGate allow={['management']} superAdminOnly>
      <main className='flex flex-1 flex-col gap-5 overflow-y-auto p-6'>
        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-lg font-semibold text-white'>프로젝트 관리</h1>
              <p className='text-sm text-slate-400'>
                회사의 프로젝트와 담당 관리자를 관리합니다. 슈퍼 관리자만 볼 수 있는 화면입니다.
              </p>
            </div>
            {myCompany && (
              <Button onClick={() => setShowAddProject(true)}>
                <PlusIcon className='h-4 w-4' />
                프로젝트 추가
              </Button>
            )}
          </div>

          <div className='mt-4'>
            {myCompany ? (
              <CompanySection
                company={myCompany}
                projects={projects}
                companyAdmins={companyAdmins}
                adminMemberships={adminMemberships}
                projectInvites={projectInvites}
                onInviteStreamers={setInvitingProject}
                onDeleteCompany={removeCompany}
                onDeleteProject={removeProject}
                onAddAdmin={() => setShowAddAdmin(true)}
                onManageAdminProjects={setManagingAdmin}
                onManageProjectAdmins={setManagingProjectAdmins}
              />
            ) : (
              <p className='text-sm text-slate-500'>소속된 회사가 없습니다.</p>
            )}
          </div>
        </Card>
      </main>

      {showAddProject && myCompany && (
        <ProjectFormModal
          company={myCompany}
          onClose={() => setShowAddProject(false)}
          onSubmit={(name, managerName) => {
            const newProject = addProject(myCompany.id, name, managerName);

            setShowAddProject(false);
            setInvitingProject(newProject);
          }}
        />
      )}

      {showAddAdmin && myCompany && (
        <AdminFormModal
          companyName={myCompany.name}
          onClose={() => setShowAddAdmin(false)}
          onSubmit={(name, loginId, password) => {
            addAdmin(myCompany.id, name, loginId, password);
            setShowAddAdmin(false);
          }}
        />
      )}

      {managingAdmin && myCompany && (
        <AdminProjectModal
          admin={managingAdmin}
          projects={projects.filter((p) => p.companyId === myCompany.id)}
          selectedProjectIds={[...adminProjectIds]}
          onClose={() => setManagingAdmin(null)}
          onSave={(projectIds) => {
            setAdminProjects(managingAdmin.id, projectIds);
            setManagingAdmin(null);
          }}
        />
      )}

      {managingProjectAdmins && myCompany && (
        <ProjectAdminModal
          project={managingProjectAdmins}
          admins={companyAdmins.filter((a) => a.level === 'general')}
          selectedAdminIds={[...projectAdminIds]}
          onClose={() => setManagingProjectAdmins(null)}
          onSave={(adminIds) => {
            setProjectAdmins(managingProjectAdmins.id, adminIds);
            setManagingProjectAdmins(null);
          }}
        />
      )}
      {invitingProject && (
        <StreamerInviteModal
          project={invitingProject}
          projects={projects}
          streamers={streamers}
          memberships={memberships}
          projectInvites={projectInvites}
          onClose={() => setInvitingProject(null)}
          onInvite={(streamerIds, phoneNumbers) => {
            inviteStreamers(invitingProject.id, streamerIds, phoneNumbers);
            setInvitingProject(null);
          }}
        />
      )}
    </RoleGate>
  );
}
