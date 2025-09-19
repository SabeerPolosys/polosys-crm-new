import DynamicTable from "@/components/table/DynamicTable";
import { SlCalender } from "react-icons/sl";
import { FaRegFileAlt } from "react-icons/fa";

export default function Leads() {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Source", accessor: "source" },
    { header: "Status", accessor: "status" },
    { header: "Lead Level", accessor: "level" },
    { header: "Assign To", accessor: "assignto" },
  ];

  const data = [
    {
      name: "John Doe",
      source: "Website",
      status: "New",
      level: "Hot",
      assignto: "Alice Johnson",
    },
    {
      name: "Emma Watson",
      source: "Referral",
      status: "Contacted",
      level: "Warm",
      assignto: "Bob Smith",
    },
    {
      name: "Liam Brown",
      source: "LinkedIn",
      status: "Qualified",
      level: "Cold",
      assignto: "Charlie Davis",
    },
    {
      name: "Olivia Green",
      source: "Email Campaign",
      status: "Lost",
      level: "Cold",
      assignto: "Diana Prince",
    },
    {
      name: "Noah White",
      source: "Phone Call",
      status: "New",
      level: "Hot",
      assignto: "Ethan Hunt",
    },
    {
      name: "Ava Black",
      source: "Website",
      status: "Qualified",
      level: "Warm",
      assignto: "Fiona Gallagher",
    },
    {
      name: "Mason Gray",
      source: "Referral",
      status: "Contacted",
      level: "Hot",
      assignto: "George Martin",
    },
    {
      name: "Sophia Blue",
      source: "Social Media",
      status: "Lost",
      level: "Cold",
      assignto: "Hannah Davis",
    },
    {
      name: "Lucas Red",
      source: "LinkedIn",
      status: "Contacted",
      level: "Warm",
      assignto: "Ian Curtis",
    },
    {
      name: "Isabella Pink",
      source: "Website",
      status: "New",
      level: "Hot",
      assignto: "Julia Roberts",
    },
  ];

  return (
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
          <button className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs">
            {" "}
            + &nbsp; Add Lead
          </button>
        </div>
      </div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
}
