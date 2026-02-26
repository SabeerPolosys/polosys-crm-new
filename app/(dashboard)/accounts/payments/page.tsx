"use client";
import DownloadCsv from "@/components/common/DownloadCsv";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { PaymentDetails } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
type GetPaymentsResponse = {
  success: boolean;
  message: string;
  data: PaymentDetails[];
};

export default function Payments() {
  const [allPayments, setAllPayments] = useState<PaymentDetails[]>([]);
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("organizationName");
  const [searchValue, setSearchValue] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getAllPayments = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<GetPaymentsResponse>(`/api/v1/payment`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setAllPayments(respose);
          setPayments(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch payments details.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllPayments();
  }, []);
  const columns = [
    {
      header: "Client Name",
      accessor: "organizationName",
      onValueClick: (e: any, row: any) => {
        e.stopPropagation();
        router.push(`/customers/${row?.clientID}`);
      },
    },
    { header: "Order Id", accessor: "transactionOrderID" },
    { header: "Payment Id", accessor: "transactionRef" },
    { header: "Date", accessor: "paidOn", specialName: "convertdatetime" },
    // { header: "Amount", accessor: "amountPaid" },
    // { header: "Tax", accessor: "taxAmount" },
    { header: "Amount", accessor: "total", specialName: "paymentTotal" },
    { header: "Plan Code", accessor: "planCode" },
    {
      header: "Status",
      accessor: "status",
      colour: {
        Pending: "bg-blue-100 text-blue-700",
        Paid: "bg-green-100 text-green-700",
        Failed: "bg-red-100 text-red-700",
      },
    },
    { header: "Payment Method", accessor: "paymentMode" },
    // { header: "Is Invoiced", accessor: "isInvoiced" },
    // { header: "Convert To Invoice", accessor: "converToInvoice" },
  ];

  // const handleRowClick = () => {
  //   router.push(`/accounts/payments/1`);
  // };
  const searchDeals = () => {
    let filtered = [...payments];

    /** ✅ Status Filter */
    if (searchStatus) {
      filtered = filtered.filter((payment) => payment.status === searchStatus);
    }

    /** ✅ Field Search */
    if (searchKey && searchValue.trim()) {
      const value = searchValue.toLowerCase();

      filtered = filtered.filter((payment: any) => {
        const fieldValue = payment?.[searchKey];

        if (!fieldValue) return false;

        return String(fieldValue).toLowerCase().includes(value);
      });
    }

    setAllPayments(filtered);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-bold px-6">Payment Details</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Demo Status Filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-10 shadow-sm">
              <label className="text-sm text-slate-500">Payment Status</label>

              <div className="relative ml-4">
                <select
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                  className="text-sm bg-transparent pr-6 focus:outline-none appearance-none p-2"
                >
                  <option value="">All</option>
                  <option value="Paid">Paid</option>
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
                <option value="organizationName">Client Name</option>
                <option value="transactionOrderID">Order Id</option>
                <option value="transactionRef">Payment Id</option>
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
          data={allPayments}
          // onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
