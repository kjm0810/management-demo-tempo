type ProjectInfoCardProps = {
  companyName: string;
  projectName: string;
  adminNames: string[];
};

export default function ProjectInfoCard({ companyName, projectName, adminNames }: ProjectInfoCardProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs text-slate-500">{companyName}</p>
        <h1 className="mt-0.5 text-xl font-semibold text-white">{projectName}</h1>
      </div>
      <div className="text-xs text-slate-400">
        담당 관리자{" "}
        <span className="text-slate-200">{adminNames.length > 0 ? adminNames.join(", ") : "미배정"}</span>
      </div>
    </div>
  );
}
