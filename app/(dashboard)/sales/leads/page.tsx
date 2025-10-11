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
    { header: "Source", accessor: "source" },
    { header: "Status", accessor: "status" },
    // { header: "Lead Level", accessor: "level" },
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
    },
    {
      name: "Emma Watson",
      source: "Referral",
      status: "Contacted",
      level: "Warm",
      assignto: "Bob Smith",
      country: "United Kingdom",
      email: "emma.watson@example.co.uk",
    },
    {
      name: "Liam Brown",
      source: "LinkedIn",
      status: "Qualified",
      level: "Cold",
      assignto: "Charlie Davis",
      country: "Australia",
      email: "liam.brown@example.com.au",
    },
    {
      name: "Olivia Green",
      source: "Email Campaign",
      status: "Lost",
      level: "Cold",
      assignto: "Diana Prince",
      country: "Canada",
      email: "olivia.green@example.ca",
    },
    {
      name: "Noah White",
      source: "Phone Call",
      status: "New",
      level: "Hot",
      assignto: "Ethan Hunt",
      country: "India",
      email: "noah.white@example.in",
    },
    {
      name: "Ava Black",
      source: "Website",
      status: "Qualified",
      level: "Warm",
      assignto: "Fiona Gallagher",
      country: "United Arab Emirates",
      email: "ava.black@example.ae",
    },
    {
      name: "Mason Gray",
      source: "Referral",
      status: "Contacted",
      level: "Hot",
      assignto: "George Martin",
      country: "Qatar",
      email: "mason.gray@example.qa",
    },
    {
      name: "Sophia Blue",
      source: "Social Media",
      status: "Lost",
      level: "Cold",
      assignto: "Hannah Davis",
      country: "Oman",
      email: "sophia.blue@example.om",
    },
    {
      name: "Lucas Red",
      source: "LinkedIn",
      status: "Contacted",
      level: "Warm",
      assignto: "Ian Curtis",
      country: "Saudi Arabia",
      email: "lucas.red@example.sa",
    },
    {
      name: "Isabella Pink",
      source: "Website",
      status: "New",
      level: "Hot",
      assignto: "Julia Roberts",
      country: "Singapore",
      email: "isabella.pink@example.sg",
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
