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
import DownloadCsv from "@/components/common/DownloadCsv";

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

  const csvHeaders = [
    { label: "Lead Id", key: "leadID" },
    { label: "Customer Name", key: "fullName" },
    { label: "Quoted Price", key: "quotedPrice" },
    { label: "Currency", key: "currencyCode" },
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
            {/* <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
              {" "}
              <FaRegFileAlt /> Export details
            </button> */}
            <DownloadCsv
              data={deals}
              headers={csvHeaders}
              styles={
                "border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400 cursor-pointer"
              }
              docName={`leads_${new Date()
                .toLocaleString("en-GB")
                .replace(/[/,:\s]/g, "_")}`}
            >
              <FaRegFileAlt /> Export details
            </DownloadCsv>
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
