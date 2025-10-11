"use client";
import DynamicTable from "@/components/table/DynamicTable";
import { SlCalender } from "react-icons/sl";
import { FaRegFileAlt } from "react-icons/fa";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import { useRouter } from "next/navigation";

export default function Deals() {
    const router = useRouter();
  const columns = [
    { header: "Lead Id", accessor: "leadId" },
    { header: "Product Name", accessor: "productName" },
    { header: "Version Name", accessor: "versionName" },
    { header: "Quoted Price", accessor: "quotedPrice" },
    { header: "Currency", accessor: "currencySymbol" },
    // { header: "Convert To Purchase", accessor: "assignto2" },
  ];

  const data = [
  {
    leadId: "L-1001",
    productName: "Books",
    versionName: "Books GCC",
    quotedPrice: 1500,
    currencySymbol: "₹",
    assignto2: "",
  },
  {
    leadId: "L-1002",
    productName: "Analytics Pro",
    versionName: "Analytics UAE",
    quotedPrice: 3200,
    currencySymbol: "د.إ",
    assignto2: "",
  },
  {
    leadId: "L-1003",
    productName: "CRM Suite",
    versionName: "CRM KSA",
    quotedPrice: 2800,
    currencySymbol: "﷼",
    assignto2: "",
  },
  {
    leadId: "L-1004",
    productName: "HRM Pro",
    versionName: "HRM Qatar",
    quotedPrice: 3000,
    currencySymbol: "﷼",
    assignto2: "",
  },
  {
    leadId: "L-1005",
    productName: "Finance Tracker",
    versionName: "Finance Oman",
    quotedPrice: 2500.75,
    currencySymbol: "﷼",
    assignto2: "",
  },
  {
    leadId: "L-1006",
    productName: "Books",
    versionName: "Books India",
    quotedPrice: 1200,
    currencySymbol: "₹",
    assignto2: "",
  },
  {
    leadId: "L-1007",
    productName: "ERP Core",
    versionName: "ERP ME",
    quotedPrice: 4700.5,
    currencySymbol: "د.إ",
    assignto2: "",
  },
  {
    leadId: "L-1008",
    productName: "Project Pro",
    versionName: "Project SA",
    quotedPrice: 3900,
    currencySymbol: "﷼",
    assignto2: "",
  },
  {
    leadId: "L-1009",
    productName: "Books",
    versionName: "Books SG",
    quotedPrice: 1100,
    currencySymbol: "S$",
    assignto2: "",
  },
  {
    leadId: "L-1010",
    productName: "Marketing Plus",
    versionName: "Marketing Global",
    quotedPrice: 5100,
    currencySymbol: "$",
    assignto2: "",
  }
];


  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  const handleRowClick = () => {
    router.push(`/sales/deals/1`);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">All Deals</h2>
          
          <div className="flex flex-row gap-2 items-center">
            <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
              {" "}
              <FaRegFileAlt /> Export details
            </button>
          </div>
        </div>
        <DynamicTable columns={columns} data={data} onRowClick={handleRowClick} />
      </div>
    </ValidatePermissions>
  );
}
