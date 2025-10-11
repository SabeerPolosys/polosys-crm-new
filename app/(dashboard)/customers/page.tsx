"use client";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { CustomerDetails } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
type CustomerResponse = {
  success: boolean;
  message: string;
  data: CustomerDetails[];
};

export default function Customer() {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const columns = [
    { header: "Organization Name", accessor: "client" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Email", accessor: "email" },
    // { header: "Server Name", accessor: "serverName" },
    // { header: "Database Name", accessor: "databaseName" },
    // { header: "Product", accessor: "product" },
    // { header: "Alias", accessor: "alias" },
    { header: "Country", accessor: "country" },
    { header: "Status", accessor: "status" },
    { header: "Change Status", accessor: "deactivate" },
  ];
  useEffect(() => {
    const getAllPermissionModules = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<CustomerResponse>(`/api/v1/client-database`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setCustomerDetails(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch customers.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllPermissionModules();
  }, []);

  const handleRowClick = (rowData: any) => {
    router.push(`/customers/${rowData.id}`);
  };

  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold">Customers</h2>
          <div>
            <button className="border-[1px] border-gray-400 px-2 py-1 rounded text-xs flex flex-row items-center gap-1 text-gray-400">
              {" "}
              <FaRegFileAlt /> Export Details
            </button>
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={customerDetails}
          onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
