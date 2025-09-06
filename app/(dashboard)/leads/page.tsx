import DynamicTable from "@/components/table/DynamicTable";


export default function page() {
  const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Source', accessor: 'source' },
  { header: 'Status', accessor: 'status' },
  { header: 'Lead Level', accessor: 'level' },
  { header: 'Assign To', accessor: 'assignto' },
];

const data = [
  {
    name: 'John Doe',
    source: 'Website',
    status: 'New',
    level: 'Hot',
    assignto: 'Alice Johnson',
  },
  {
    name: 'Emma Watson',
    source: 'Referral',
    status: 'Contacted',
    level: 'Warm',
    assignto: 'Bob Smith',
  },
  {
    name: 'Liam Brown',
    source: 'LinkedIn',
    status: 'Qualified',
    level: 'Cold',
    assignto: 'Charlie Davis',
  },
  {
    name: 'Olivia Green',
    source: 'Email Campaign',
    status: 'Lost',
    level: 'Cold',
    assignto: 'Diana Prince',
  },
  {
    name: 'Noah White',
    source: 'Phone Call',
    status: 'New',
    level: 'Hot',
    assignto: 'Ethan Hunt',
  },
  {
    name: 'Ava Black',
    source: 'Website',
    status: 'Qualified',
    level: 'Warm',
    assignto: 'Fiona Gallagher',
  },
  {
    name: 'Mason Gray',
    source: 'Referral',
    status: 'Contacted',
    level: 'Hot',
    assignto: 'George Martin',
  },
  {
    name: 'Sophia Blue',
    source: 'Social Media',
    status: 'Lost',
    level: 'Cold',
    assignto: 'Hannah Davis',
  },
  {
    name: 'Lucas Red',
    source: 'LinkedIn',
    status: 'Contacted',
    level: 'Warm',
    assignto: 'Ian Curtis',
  },
  {
    name: 'Isabella Pink',
    source: 'Website',
    status: 'New',
    level: 'Hot',
    assignto: 'Julia Roberts',
  },
];

  return (
    <div className="rounded-lg py-10 bg-white">
      <h2 className="text-xl font-bold px-6">All Leads</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
}
