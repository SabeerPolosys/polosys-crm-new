export default function OverviewCard({ title, value }:{title:string, value:string}) {
  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow border border-gray-200">
      <span className="text-sm text-gray-500">{title}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}
