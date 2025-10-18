"use client";
import DynamicTable from "@/components/table/DynamicTable";
import { SlCalender } from "react-icons/sl";
import { FaRegFileAlt } from "react-icons/fa";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { showToast } from "@/components/common/ShowToast";

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const columns = [
    { header: "Lead Id", accessor: "leadID" },
    { header: "Customer Name", accessor: "fullName" },
    // { header: "Version Name", accessor: "versionName" },
    { header: "Quoted Price", accessor: "quotedPrice" },
    { header: "Currency", accessor: "currencyCode" },
    // { header: "Created By", accessor: "createdBy" },
    {
      header: "Status",
      accessor: "status",
      specialName: "changeableStatus",
      isConvert: true,
      colour: {
        "Quote Sent": "bg-blue-200 text-blue-800",
        "Confirmed Purchase": "bg-green-200 text-green-800",
      },
      options: [
        { value: "Quote Send", key: "Quoted" },
        { value: "Confirm Purchase", key: "Purchased" },
      ],
    },
    // { header: "Convert To Purchase", accessor: "assignto2" },
  ];
  useEffect(() => {
    const getAllLeads = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<any>(`/api/v1/deal`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setDeals(respose || []);
        }
      } catch {
        showToast({
          message: `Failed to fetch deals.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllLeads();
  }, []);
  //   const data = [
  //   {
  //     leadId: "L-1001",
  //     productName: "Books",
  //     versionName: "Books GCC",
  //     quotedPrice: 1500,
  //     currencySymbol: "₹",
  //     assignto2: "",
  //     createdBy: "Alice Johnson",
  //     status: "Quote Sent",
  //   },
  //   {
  //     leadId: "L-1002",
  //     productName: "Analytics Pro",
  //     versionName: "Analytics UAE",
  //     quotedPrice: 3200,
  //     currencySymbol: "د.إ",
  //     assignto2: "",
  //     createdBy: "Bob Smith",
  //     status: "Confirmed Purchase",
  //   },
  //   {
  //     leadId: "L-1003",
  //     productName: "CRM Suite",
  //     versionName: "CRM KSA",
  //     quotedPrice: 2800,
  //     currencySymbol: "﷼",
  //     assignto2: "",
  //     createdBy: "Charlie Davis",
  //     status: "Quote Sent",
  //   },
  //   {
  //     leadId: "L-1004",
  //     productName: "HRM Pro",
  //     versionName: "HRM Qatar",
  //     quotedPrice: 3000,
  //     currencySymbol: "﷼",
  //     assignto2: "",
  //     createdBy: "Diana Prince",
  //     status: "Confirmed Purchase",
  //   },
  //   {
  //     leadId: "L-1005",
  //     productName: "Finance Tracker",
  //     versionName: "Finance Oman",
  //     quotedPrice: 2500.75,
  //     currencySymbol: "﷼",
  //     assignto2: "",
  //     createdBy: "Ethan Hunt",
  //     status: "Quote Sent",
  //   },
  //   {
  //     leadId: "L-1006",
  //     productName: "Books",
  //     versionName: "Books India",
  //     quotedPrice: 1200,
  //     currencySymbol: "₹",
  //     assignto2: "",
  //     createdBy: "Fiona Gallagher",
  //     status: "Confirmed Purchase",
  //   },
  //   {
  //     leadId: "L-1007",
  //     productName: "ERP Core",
  //     versionName: "ERP ME",
  //     quotedPrice: 4700.5,
  //     currencySymbol: "د.إ",
  //     assignto2: "",
  //     createdBy: "George Martin",
  //     status: "Quote Sent",
  //   },
  //   {
  //     leadId: "L-1008",
  //     productName: "Project Pro",
  //     versionName: "Project SA",
  //     quotedPrice: 3900,
  //     currencySymbol: "﷼",
  //     assignto2: "",
  //     createdBy: "Hannah Davis",
  //     status: "Confirmed Purchase",
  //   },
  //   {
  //     leadId: "L-1009",
  //     productName: "Books",
  //     versionName: "Books SG",
  //     quotedPrice: 1100,
  //     currencySymbol: "S$",
  //     assignto2: "",
  //     createdBy: "Ian Curtis",
  //     status: "Quote Sent",
  //   },
  //   {
  //     leadId: "L-1010",
  //     productName: "Marketing Plus",
  //     versionName: "Marketing Global",
  //     quotedPrice: 5100,
  //     currencySymbol: "$",
  //     assignto2: "",
  //     createdBy: "Julia Roberts",
  //     status: "Confirmed Purchase",
  //   },
  // ];

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
        <DynamicTable
          columns={columns}
          data={deals}
          // onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
