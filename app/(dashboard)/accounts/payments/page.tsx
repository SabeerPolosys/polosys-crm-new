"use client";
import DownloadCsv from "@/components/common/DownloadCsv";
import { showToast } from "@/components/common/ShowToast";
import CustomSelect from "@/components/customers/CustomSelect";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { PaymentDetails } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [paymentStatus, setPaymentStatus] = useState("");
  const [clientName, setClientName] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [planCode, setPlanCode] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [startFilterType, setStartFilterType] = useState("eq");
  const [amountFilterType, setAmountFilterType] = useState("eq");
  const [amount, setAmount] = useState("");
  const [isResetPage, setIsResetPage] = useState(1);
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
  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const applyDateFilter = (
    data: PaymentDetails[],
    operator: string,
    value: Date | null,
  ) => {
    if (!value) return data;

    const selected = normalizeDate(value);

    return data.filter((item) => {
      if (!item.paidOn) return false;

      const itemDate = normalizeDate(new Date(item.paidOn));

      switch (operator) {
        case "eq":
          return itemDate.getTime() === selected.getTime();
        case "gt":
          return itemDate > selected;
        case "gte":
          return itemDate >= selected;
        case "lt":
          return itemDate < selected;
        case "lte":
          return itemDate <= selected;
        default:
          return true;
      }
    });
  };

  const applyAmountFilter = (
    data: PaymentDetails[],
    operator: string,
    value: number | null,
  ) => {
    if (value === null) return data;

    return data.filter((item) => {
      const amt = Number(item.amountPaid || 0);

      switch (operator) {
        case "eq":
          return amt === value;
        case "gt":
          return amt > value;
        case "gte":
          return amt >= value;
        case "lt":
          return amt < value;
        case "lte":
          return amt <= value;
        default:
          return true;
      }
    });
  };

  const handleSearch = () => {
    let filtered = [...payments]; // ✅ always original data

    /** ✅ Payment Status */
    if (paymentStatus) {
      filtered = filtered.filter((p) => p.status === paymentStatus);
    }

    /** ✅ Client Name */
    if (clientName.trim()) {
      const value = clientName.toLowerCase();
      filtered = filtered.filter((p) =>
        p.organizationName?.toLowerCase().includes(value),
      );
    }

    /** ✅ Order ID / Payment ID */
    if (paymentId.trim()) {
      const value = paymentId.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.transactionOrderID?.toLowerCase().includes(value) ||
          p.transactionRef?.toLowerCase().includes(value),
      );
    }

    /** ✅ Plan Code */
    if (planCode.trim()) {
      const value = planCode.toLowerCase();
      filtered = filtered.filter((p) =>
        p.planCode?.toLowerCase().includes(value),
      );
    }

    /** ✅ Date Filter */
    filtered = applyDateFilter(filtered, startFilterType, startDate);

    /** ✅ Amount Filter */
    const parsedAmount = amount ? Number(amount) : null;
    filtered = applyAmountFilter(filtered, amountFilterType, parsedAmount);

    setAllPayments(filtered);
    setIsResetPage(prev=>prev+1);
  };
  const resetFilters = () => {
    setPaymentStatus("");
    setClientName("");
    setPaymentId("");
    setPlanCode("");
    setStartFilterType("eq");
    setAmountFilterType("eq");
    setStartDate("");
    setAmount("");
    setAllPayments(payments);
  }
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 mb-2 flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">Payment Details</h2>
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
        <div className="px-6">
          <div className="p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 items-end">
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">
                  Payment Status
                </label>
                <CustomSelect
                  value={paymentStatus}
                  onChange={setPaymentStatus}
                  placeholder="All"
                  options={[
                    { label: "All", value: "" },
                    { label: "Paid", value: "Paid" },
                    { label: "Pending", value: "Pending" },
                    { label: "Failed", value: "Failed" },
                  ]}
                  width="w-full"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="Enter client name..."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">
                  Order/Payment Id
                </label>
                <input
                  type="text"
                  placeholder="Enter order or payment id..."
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Plan Code</label>
                <input
                  type="text"
                  placeholder="Enter plan code..."
                  value={planCode}
                  onChange={(e) => setPlanCode(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">
                  Start Date
                </label>
                <div className="flex flex-row border-[1px] rounded-lg">
                  <CustomSelect
                    value={startFilterType}
                    onChange={setStartFilterType}
                    options={[
                      { label: "Equal (=)", value: "eq" },
                      { label: "Greater than (>)", value: "gt" },
                      { label: "Greater than or equal (>=)", value: "gte" },
                      { label: "Less than (<)", value: "lt" },
                      { label: "Less than or equal (<=)", value: "lte" },
                    ]}
                    width={"w-28"}
                    isLeftOnlyRonded={true}
                  />
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    // className="h-10 px-3 border rounded-r-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
                    className="h-10 px-3 text-sm w-full focus:outline-none"
                    placeholderText="Select payment date"
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Amount</label>
                <div className="flex flex-row border-[1px] rounded-lg">
                  <CustomSelect
                    value={amountFilterType}
                    onChange={setAmountFilterType}
                    options={[
                      { label: "Equal (=)", value: "eq" },
                      { label: "Greater than (>)", value: "gt" },
                      { label: "Greater than or equal (>=)", value: "gte" },
                      { label: "Less than (<)", value: "lt" },
                      { label: "Less than or equal (<=)", value: "lte" },
                    ]}
                    width={"w-28"}
                    isLeftOnlyRonded={true}
                  />
                  <input
                    type="number"
                    placeholder="Enter amount..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="h-10 px-5 bg-gray-800 text-white rounded-lg text-sm font-medium shadow hover:bg-gray-900 transition cursor-pointer"
                >
                  Search
                </button>

                <button
                  onClick={resetFilters}
                  className="h-10 px-5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-bold px-6">Payment Details</h2>
          <div className="flex flex-wrap items-center gap-3">
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

            <input
              type="text"
              placeholder="Search leads..."
              className="h-10 w-64 lg:w-80 px-3 border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button
              onClick={() => searchDeals()}
              className="h-10 px-4 bg-gray-700 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-gray-900 transition cursor-pointer"
            >
              Search
            </button>

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
        </div> */}
        <DynamicTable
          columns={columns}
          data={allPayments}
          // onRowClick={handleRowClick}
          isResetPage={isResetPage}
        />
      </div>
    </ValidatePermissions>
  );
}
