"use client";
import DynamicTable from "@/components/table/DynamicTable";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const columns = [
    { header: "Customer", accessor: "name" },
    { header: "Location", accessor: "location" },
    { header: "Contact", accessor: "contact" },
    { header: "Email", accessor: "email" },
    { header: "Country", accessor: "country" },
    { header: "Type", accessor: "type" },
  ];

  const data = [
    {
      id: 1,
      name: "John Smith",
      location: "New York",
      contact: "+1 555-1234",
      email: "john.smith@example.com",
      country: "USA",
      type: "Individual",
    },
    {
      id: 2,
      name: "Emma Johnson",
      location: "Toronto",
      contact: "+1 416-555-7890",
      email: "emma.johnson@example.ca",
      country: "Canada",
      type: "Business",
    },
    {
      id: 3,
      name: "Carlos Ramirez",
      location: "Mexico City",
      contact: "+52 55 1234 5678",
      email: "carlos.ramirez@example.mx",
      country: "Mexico",
      type: "Individual",
    },
    {
      id: 4,
      name: "Akira Tanaka",
      location: "Tokyo",
      contact: "+81 3-1234-5678",
      email: "akira.tanaka@example.jp",
      country: "Japan",
      type: "Business",
    },
    {
      id: 5,
      name: "Sophia Müller",
      location: "Berlin",
      contact: "+49 30 123456",
      email: "sophia.mueller@example.de",
      country: "Germany",
      type: "Individual",
    },
    {
      id: 6,
      name: "Liam O'Connor",
      location: "Dublin",
      contact: "+353 1 234 5678",
      email: "liam.oconnor@example.ie",
      country: "Ireland",
      type: "Business",
    },
    {
      id: 7,
      name: "Priya Patel",
      location: "Mumbai",
      contact: "+91 22 2345 6789",
      email: "priya.patel@example.in",
      country: "India",
      type: "Individual",
    },
    {
      id: 8,
      name: "Chen Wei",
      location: "Shanghai",
      contact: "+86 21 1234 5678",
      email: "chen.wei@example.cn",
      country: "China",
      type: "Business",
    },
    {
      id: 9,
      name: "Isabella Rossi",
      location: "Rome",
      contact: "+39 06 1234 5678",
      email: "isabella.rossi@example.it",
      country: "Italy",
      type: "Individual",
    },
    {
      id: 10,
      name: "Mohammed Al-Farsi",
      location: "Dubai",
      contact: "+971 4 123 4567",
      email: "mohammed.alfarsi@example.ae",
      country: "UAE",
      type: "Business",
    },
  ];

  const handleRowClick = (rowData: any) => {
    router.push(`/customers/${rowData.id}`);
  };

  return (
    <div className="rounded-lg py-10 bg-white">
      <h2 className="text-xl font-bold px-6">Customers</h2>
      <DynamicTable columns={columns} data={data} onRowClick={handleRowClick} />
    </div>
  );
}
