"use client";
import DownloadCsv from "@/components/common/DownloadCsv";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

export default function PurchaseDetails() {
  const [purchaseDetails, setPurchaseDetails] = useState<any[]>([]);
  const [allPurchaseDetails, setAllPurchaseDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("clientName");
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getAllPurchases = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/v1/purchase`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setPurchaseDetails(respose);
          setAllPurchaseDetails(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch purchase details.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllPurchases();
  }, []);
  const columns = [
    // { header: "Product", accessor: "product" },
    // { header: "Version", accessor: "version" },
    // { header: "Purchase Date", accessor: "purchaseDate" },
    // { header: "Plan", accessor: "plan" },
    // { header: "Last Renewed Date", accessor: "planLastRenewedDate" },
    // { header: "Plan Expiry Date", accessor: "planExpireDate" },
    // { header: "Status", accessor: "planStatus" },
    // { header: "Price", accessor: "purchasePrice" },
    // { header: "Currency", accessor: "currencySymbol" },
    // { header: "Customer Name", accessor: "customerName" },
    // { header: "Auto Renew", accessor: "isAutoRenew" },
    { header: "Client Name", accessor: "clientName" },
    { header: "Product Name", accessor: "productName" },
    { header: "Plan Name", accessor: "planName" },
    { header: "Country", accessor: "countryCode" },
    // { header: "Currency", accessor: "currencyCode" },
    {
      header: "Total Price",
      accessor: "totalPrice.currencyCode",
      specialName: "combileCurrency",
    },
    {
      header: "Purchased On",
      accessor: "purchaseDate",
      specialName: "convertdatetime",
    },
    {
      header: "Expire On",
      accessor: "endDate",
      specialName: "convertdate",
    },
    {
      header: "Status",
      accessor: "statusname",
      specialName: "status",
      colour: {
        Confirm: "bg-blue-100 text-blue-700",
        Invoiced: "bg-green-100 text-green-700",
        Cancelled: "bg-red-100 text-red-700",
        Processing: "bg-yellow-100 text-yellow-700",
        PaymentInitialized: "bg-purple-100 text-purple-700",
        Returned: "bg-orange-100 text-orange-700",
      },
    },
  ];

  const handleRowClick = (row) => {
    router.push(`/accounts/purchases/${row?.purchaseOrderID}`);
  };
  const searchDeals = () => {
    let filtered = [...allPurchaseDetails];

    /** ✅ Field Search */
    if (searchKey && searchValue.trim()) {
      const value = searchValue.toLowerCase();

      filtered = filtered.filter((purchase: any) => {
        const fieldValue = purchase?.[searchKey];

        if (!fieldValue) return false;

        return String(fieldValue).toLowerCase().includes(value);
      });
    }

    setPurchaseDetails(filtered);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-bold px-6">Purchase Details</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Type */}
            <div className="relative">
              <select
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="h-10 px-3 pr-8 border border-slate-200 rounded-lg text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="clientName">Client Name</option>
                <option value="productName">Product Name</option>
                <option value="planName">Plan Name</option>
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
          data={purchaseDetails}
          onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
