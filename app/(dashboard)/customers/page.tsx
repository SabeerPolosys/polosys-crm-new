"use client";
import ActionConfirmationModal from "@/components/common/ActionConfirmationModal";
import DownloadCsv from "@/components/common/DownloadCsv";
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
  const [allCustomers, setAllCustomers] = useState<CustomerDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("organizationName");
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateCustomer, setUpdateCustomer] = useState<CustomerDetails | null>(
    null,
  );
  const [searchStatus, setSearchStatus] = useState("");
  const [updateFlag, setUpdateFlag] = useState(1);
  const router = useRouter();
  const columns = [
    { header: "Organization Name", accessor: "organizationName" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Email", accessor: "email" },
    { header: "Country", accessor: "countryName" },
    { header: "Status", accessor: "statusName" },
    { header: "Product Name", accessor: "name" },
    { header: "Plan Name", accessor: "planName" },
    {
      header: "Start Date",
      accessor: "startDate",
      specialName: "convertdatetime",
    },
    { header: "End Date", accessor: "endDate", specialName: "convertdatetime" },
    { header: "Type", accessor: "typeName" },
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
        // if (searchKey && searchValue) {
        //   const res = await api.get<CustomerResponse>(
        //     `/api/v1/common/Clientfilter?${searchKey}=${searchValue}`,
        //   );
        //   if (res?.data?.success) {
        //     const respose = res?.data?.data;
        //     setCustomerDetails(respose || []);
        //     setAllCustomers(respose || []);
        //   }
        // } else {
        const res = await api.get<CustomerResponse>(`/api/v1/common/Client`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setCustomerDetails(respose || []);
          setAllCustomers(respose || []);
          if (searchStatus || (searchKey && searchValue.trim())) {
            searchDeals(respose || []);
          }
        }
        // }
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
  }, [updateFlag]);
  // searchKey, searchValue,

  const handleRowClick = (rowData: any) => {
    router.push(`/customers/${rowData.clientID}`);
  };
  const getExpiryStatus = (endDate: string) => {
    if (!endDate) return "expired";

    const today = new Date();
    const expiry = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "expired";
    return "active";
  };
  const searchDeals = (customers?: any) => {
    let filtered = [...allCustomers];
    if (customers) {
      filtered = [...customers];
    }

    /** ✅ Plan Status Filter */
    if (searchStatus) {
      filtered = filtered.filter((customer: any) => {
        if (searchStatus === "expired") {
          return getExpiryStatus(customer.endDate) === "expired";
        }

        if (searchStatus === "Active" || searchStatus === "Inactive") {
          return customer.statusName === searchStatus;
        }

        // Demo / Registered
        return customer.typeName === searchStatus;
      });
    }

    /** ✅ Field Search */
    if (searchKey && searchValue.trim()) {
      const value = searchValue.toLowerCase();

      filtered = filtered.filter((customer: any) => {
        const fieldValue = customer?.[searchKey];

        if (!fieldValue) return false;

        return String(fieldValue).toLowerCase().includes(value);
      });
    }

    setCustomerDetails(filtered);
  };

  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-bold">Customers</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Demo Status Filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-10 shadow-sm">
              <label className="text-sm text-slate-500">Plan Status</label>

              <div className="relative ml-4">
                <select
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                  className="text-sm bg-transparent pr-6 focus:outline-none appearance-none p-2"
                >
                  <option value="">All</option>
                  <option value="Demo">Demo</option>
                  <option value="Registered">Registered</option>
                  <option value="expired">Expired</option>
                  <option value="Active">Active User</option>
                  <option value="Inactive">Inactive User</option>
                </select>

                <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              </div>
            </div>

            {/* Search Type */}
            <div className="relative">
              <select
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="h-10 px-3 pr-8 border border-slate-200 rounded-lg text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="organizationName">Organization Name</option>
                <option value="email">Email</option>
                <option value="name">Product Name</option>
                <option value="planCode">Plan Code</option>
              </select>

              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search leads..."
              className="h-10 w-64 lg:w-80 px-3 border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {/* Search Button */}
            <button
              onClick={() => searchDeals()}
              className="h-10 px-4 bg-gray-700 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-gray-900 transition cursor-pointer"
            >
              Search
            </button>

            {/* Export Button */}
            <DownloadCsv
              data={[]}
              headers={[]}
              styles="h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white shadow-sm hover:bg-slate-50 flex items-center gap-2"
              docName={`leads_${new Date()
                .toLocaleString("en-GB")
                .replace(/[/,:\s]/g, "_")}`}
            >
              <FaRegFileAlt className="text-slate-400" />
              Export
            </DownloadCsv>
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
