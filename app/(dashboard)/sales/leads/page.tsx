"use client";
import DynamicTable from "@/components/table/DynamicTable";
import { SlCalender } from "react-icons/sl";
import { FaRegFileAlt } from "react-icons/fa";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";

export default function Leads() {
  const columns = [
    { header: "Full Name", accessor: "name" },
    { header: "Country", accessor: "country" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Source", accessor: "source" },
    {
      header: "Status",
      accessor: "status",
      specialName: "changeableStatus",
      colour: {
        New: "bg-gray-200 text-gray-700",
        Contacted: "bg-blue-100 text-blue-700",
        Quoted: "bg-green-100 text-green-700",
        Lost: "bg-red-100 text-red-700",
        Pending: "bg-orange-100 text-orange-700",
      },
      options: [
        { value: "New", key: "New" },
        { value: "Contacted", key: "Contacted" },
        { value: "Quoted", key: "Quoted" },
        { value: "Lost", key: "Lost" },
        { value: "Pending", key: "Pending" },
      ],
    },
    {
      header: "Priority Level",
      accessor: "level",
      specialName: "changeableStatus",
      colour: {
        Cold: "bg-blue-200 text-blue-800",
        Warm: "bg-yellow-200 text-yellow-800",
        Hot: "bg-red-200 text-red-800",
      },
      options: [
        { value: "Hot", key: "Hot" },
        { value: "Cold", key: "Cold" },
        { value: "Warm", key: "Warm" },
      ],
    },
    // { header: "Assigned To", accessor: "assignto" },
    // { header: "Assign", accessor: "assignto1" },
    { header: "Convert To Deal", accessor: "convertToDeal" },
  ];

  const data = [
  {
    name: "John Doe",
    source: "Website",
    status: "New",
    level: "Hot",
    assignto: "Alice Johnson",
    country: "United States",
    email: "john.doe@example.com",
    phone: "+1 202-555-0101",
  },
  {
    name: "Emma Watson",
    source: "Referral",
    status: "Contacted",
    level: "Warm",
    assignto: "Bob Smith",
    country: "United Kingdom",
    email: "emma.watson@example.co.uk",
    phone: "+44 7700 900123",
  },
  {
    name: "Liam Brown",
    source: "LinkedIn",
    status: "Quoted",
    level: "Cold",
    assignto: "Charlie Davis",
    country: "Australia",
    email: "liam.brown@example.com.au",
    phone: "+61 412 345 678",
  },
  {
    name: "Olivia Green",
    source: "Email Campaign",
    status: "Lost",
    level: "Cold",
    assignto: "Diana Prince",
    country: "Canada",
    email: "olivia.green@example.ca",
    phone: "+1 416-555-0198",
  },
  {
    name: "Noah White",
    source: "Phone Call",
    status: "New",
    level: "Hot",
    assignto: "Ethan Hunt",
    country: "India",
    email: "noah.white@example.in",
    phone: "+91 98765 43210",
  },
  {
    name: "Ava Black",
    source: "Website",
    status: "Pending",
    level: "Warm",
    assignto: "Fiona Gallagher",
    country: "United Arab Emirates",
    email: "ava.black@example.ae",
    phone: "+971 50 123 4567",
  },
  {
    name: "Mason Gray",
    source: "Referral",
    status: "Contacted",
    level: "Hot",
    assignto: "George Martin",
    country: "Qatar",
    email: "mason.gray@example.qa",
    phone: "+974 5555 1234",
  },
  {
    name: "Sophia Blue",
    source: "Social Media",
    status: "Lost",
    level: "Cold",
    assignto: "Hannah Davis",
    country: "Oman",
    email: "sophia.blue@example.om",
    phone: "+968 9212 3456",
  },
  {
    name: "Lucas Red",
    source: "LinkedIn",
    status: "Contacted",
    level: "Warm",
    assignto: "Ian Curtis",
    country: "Saudi Arabia",
    email: "lucas.red@example.sa",
    phone: "+966 5 555 1234",
  },
  {
    name: "Isabella Pink",
    source: "Website",
    status: "New",
    level: "Hot",
    assignto: "Julia Roberts",
    country: "Singapore",
    email: "isabella.pink@example.sg",
    phone: "+65 8123 4567",
  },
];


  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">All Leads</h2>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex items-center gap-2 border border-gray-400 rounded px-4 py-1 text-xs text-gray-400">
              {/* Rounded dot */}
              <span className="w-2 h-2 rounded-full bg-red-500"></span>

              {/* Text content */}
              <span>Hot level</span>

              {/* Number */}
              <span className="text-lg text-gray-600">&nbsp;151</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-400 rounded px-4 py-1 text-xs text-gray-400">
              {/* Rounded dot */}
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>

              {/* Text content */}
              <span>Warm level</span>

              {/* Number */}
              <span className="text-lg text-gray-600">&nbsp;283</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-400 rounded px-4 py-1 text-xs text-gray-400">
              {/* Rounded dot */}
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>

              {/* Text content */}
              <span>Cold level</span>

              {/* Number */}
              <span className="text-lg text-gray-600">&nbsp;89</span>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
              {" "}
              <SlCalender /> Monthly
            </button>
            <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
              {" "}
              <FaRegFileAlt /> Export details
            </button>
            {canCreate && (
              <button className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs">
                {" "}
                + &nbsp; Add Lead
              </button>
            )}
          </div>
        </div>
        <DynamicTable columns={columns} data={data} />
      </div>
    </ValidatePermissions>
  );
}
