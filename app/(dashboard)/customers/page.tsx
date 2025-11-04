"use client";
import ActionConfirmationModal from "@/components/common/ActionConfirmationModal";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { CustomerDetails } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
type CustomerResponse = {
  success: boolean;
  message: string;
  data: CustomerDetails[];
};

export default function Customer() {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("OrganizationName");
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateCustomer, setUpdateCustomer] = useState<CustomerDetails | null>(
    null
  );
  const [updateFlag, setUpdateFlag] = useState(1);
  const router = useRouter();
  const columns = [
    { header: "Organization Name", accessor: "organizationName" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Email", accessor: "email" },
    { header: "Country", accessor: "countryName" },
    { header: "Status", accessor: "statusName" },
    {
      header: "Change Status",
      accessor: "deactivate",
      onClick: () => setIsModalOpen(true),
      setUpdateDetails: setUpdateCustomer,
    },
  ];
  useEffect(() => {
    const getCustomerDetails = async () => {
      try {
        setIsLoading(true);
        if (searchKey && searchValue) {
          const res = await api.get<CustomerResponse>(
            `/api/v1/common/Clientfilter?${searchKey}=${searchValue}`
          );
          if (res?.data?.success) {
            const respose = res?.data?.data;
            setCustomerDetails(respose || []);
          }
        } else {
          const res = await api.get<CustomerResponse>(`/api/v1/common/Client`);
          if (res?.data?.success) {
            const respose = res?.data?.data;
            setCustomerDetails(respose || []);
          }
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
    getCustomerDetails();
  }, [searchKey, searchValue, updateFlag]);

  const handleRowClick = (rowData: any) => {
    router.push(`/customers/${rowData.clientID}`);
  };

  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-bold">Customers</h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative">
              <select
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
              >
                <option value="OrganizationName">Organization Name</option>
                <option value="Email">Email</option>
                <option value="Mobile">Mobile</option>
              </select>

              {/* Custom Arrow Icon with space after */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <FiChevronDown className="text-gray-600" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="border border-gray-300 px-3 py-1 h-9 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="border-[1px] border-gray-400 px-2 py-1 h-9 rounded text-xs flex flex-row items-center gap-1 text-gray-400">
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
      <ActionConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Change User Status"
        message="Are you sure you want to continue?"
        confirmLabel="Yes, continue"
        cancelLabel="Cancel"
        onConfirm={async () => {
          if (updateCustomer?.clientID) {
            await api.put("/api/v1/common/Client", {
              clientID: updateCustomer?.clientID,
              statusID: updateCustomer?.statusID === 11 ? 4 : 11,
              isActive: true,
            });
            showToast({ message: "Status changed", type: "success" });
            setUpdateFlag((prev) => prev + 1);
          } else {
            showToast({ message: "Failed to perform action.", type: "error" });
          }
        }}
      />
    </ValidatePermissions>
  );
}
