import DynamicTable from "@/components/table/DynamicTable";


export default function page() {
  const columns = [
  { header: 'No', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Contact', accessor: 'contact' },
  { header: 'Role', accessor: 'role' },
  { header: 'Email', accessor: 'email' },
  { header: 'Action', accessor: 'action' },
];

const data = [
  {
    id: 1,
    name: 'Alice Johnson',
    contact: '+1 555-1234',
    role: 'Admin',
    email: 'alice.johnson@example.com',
    action: 'Edit',
  },
  {
    id: 2,
    name: 'Bob Smith',
    contact: '+1 555-5678',
    role: 'Editor',
    email: 'bob.smith@example.com',
    action: 'Edit',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    contact: '+1 555-9012',
    role: 'Viewer',
    email: 'charlie.brown@example.com',
    action: 'Edit',
  },
  {
    id: 4,
    name: 'Diana Prince',
    contact: '+1 555-3456',
    role: 'Admin',
    email: 'diana.prince@example.com',
    action: 'Edit',
  },
  {
    id: 5,
    name: 'Ethan Hunt',
    contact: '+1 555-7890',
    role: 'Editor',
    email: 'ethan.hunt@example.com',
    action: 'Edit',
  },
  {
    id: 6,
    name: 'Fiona Gallagher',
    contact: '+1 555-2345',
    role: 'Viewer',
    email: 'fiona.gallagher@example.com',
    action: 'Edit',
  },
  {
    id: 7,
    name: 'George Martin',
    contact: '+1 555-6789',
    role: 'Admin',
    email: 'george.martin@example.com',
    action: 'Edit',
  },
  {
    id: 8,
    name: 'Hannah Davis',
    contact: '+1 555-0123',
    role: 'Editor',
    email: 'hannah.davis@example.com',
    action: 'Edit',
  },
  {
    id: 9,
    name: 'Ian Curtis',
    contact: '+1 555-4567',
    role: 'Viewer',
    email: 'ian.curtis@example.com',
    action: 'Edit',
  },
  {
    id: 10,
    name: 'Julia Roberts',
    contact: '+1 555-8910',
    role: 'Admin',
    email: 'julia.roberts@example.com',
    action: 'Edit',
  },
];




  return (
    <div className="rounded-lg py-10 bg-white">
      <h2 className="text-xl font-bold px-6">Users & Roles</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
}
