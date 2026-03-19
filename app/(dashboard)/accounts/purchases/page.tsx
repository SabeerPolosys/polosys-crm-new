"use client";
import DownloadCsv from "@/components/common/DownloadCsv";
import { showToast } from "@/components/common/ShowToast";
import CustomSelect from "@/components/customers/CustomSelect";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PurchaseDetails() {
  const [purchaseDetails, setPurchaseDetails] = useState<any[]>([]);
  const [allPurchaseDetails, setAllPurchaseDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("clientName");
  const [searchValue, setSearchValue] = useState("");
  const [country, setCountry] = useState("");
  const [allContries, setAllContries] = useState<any>([]);
  const [allProducts, setAllProducts] = useState<any>([]);
  const [productName, setProductName] = useState("");
  const [clientName, setClientName] = useState("");
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [startFilterType, setStartFilterType] = useState("eq");
  const [endFilterType, setEndFilterType] = useState("eq");
  const [amountFilterType, setAmountFilterType] = useState("eq");
  const [amount, setAmount] = useState("");
  const [isResetPage, setIsResetPage] = useState(1);

  const router = useRouter();
  useEffect(() => {
    const getAllCountries = async () => {
      try {
        const res = await api.get(`/api/v1/common/countries`);
        if (res?.data?.success) {
          const response = res?.data?.data;
          setAllContries(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch countries.`,
          type: "error",
        });
      }
    };
    getAllCountries();
  }, []);
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await api.get(`/api/v1/product`);
        if (res?.data?.success) {
          const response = res?.data?.data;
          setAllProducts(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch products.`,
          type: "error",
        });
      }
    };
    getAllProducts();
  }, []);
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
  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const applyDateFilter = (
    data: any[],
    field: "purchaseDate" | "endDate",
    operator: string,
    value: Date | null,
  ) => {
    if (!value) return data;

    const selected = normalizeDate(value);

    return data.filter((item) => {
      if (!item[field]) return false;

      const itemDate = normalizeDate(new Date(item[field]));

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
    data: any[],
    operator: string,
    value: number | null,
  ) => {
    if (value === null || isNaN(value)) return data;

    return data.filter((item) => {
      const price = Number(item.totalPrice);

      switch (operator) {
        case "eq":
          return price === value;
        case "gt":
          return price > value;
        case "gte":
          return price >= value;
        case "lt":
          return price < value;
        case "lte":
          return price <= value;
        default:
          return true;
      }
    });
  };

  const handleSearch = () => {
    let filtered = [...allPurchaseDetails];

    /** ✅ Country */
    if (country) {
      filtered = filtered.filter((p) => p.countryID === country);
    }

    /** ✅ Product */
    if (productName) {
      filtered = filtered.filter(
        (p) => p.productName?.toLowerCase() === productName.toLowerCase(),
      );
    }

    /** ✅ Plan Name (partial match) */
    if (planName.trim()) {
      const value = planName.toLowerCase();
      filtered = filtered.filter((p) =>
        p.planName?.toLowerCase().includes(value),
      );
    }

    /** ✅ Client Name */
    if (clientName.trim()) {
      const value = clientName.toLowerCase();
      filtered = filtered.filter((p) =>
        p.clientName?.toLowerCase().includes(value),
      );
    }

    /** ✅ Purchase Date */
    filtered = applyDateFilter(
      filtered,
      "purchaseDate",
      startFilterType,
      startDate,
    );

    /** ✅ Expiry Date */
    filtered = applyDateFilter(filtered, "endDate", endFilterType, endDate);

    /** ✅ Amount Filter */
    filtered = applyAmountFilter(
      filtered,
      amountFilterType,
      amount ? Number(amount) : null,
    );
    setIsResetPage((prev) => prev + 1);
    setPurchaseDetails(filtered);
  };
  const resetFilters = () => {
    /** Reset all filter states */
    setCountry("");
    setProductName("");
    setPlanName("");
    setClientName("");
    setStartDate(null);
    setEndDate(null);
    setStartFilterType("eq");
    setEndFilterType("eq");
    setAmount("");
    setAmountFilterType("eq");
    setPurchaseDetails(allPurchaseDetails);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 mb-2 flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">Purchase Details</h2>
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
              {/* Country */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Country</label>
                <CustomSelect
                  value={country}
                  onChange={setCountry}
                  placeholder="Select Country"
                  options={[
                    { label: "All", value: "" },
                    ...allContries?.map((country: any) => ({
                      label: country?.countryName,
                      value: country?.countryId,
                    })),
                  ]}
                  width="w-full"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">
                  Product Name
                </label>
                <CustomSelect
                  value={productName}
                  onChange={setProductName}
                  placeholder="Select Country"
                  options={[
                    { label: "All", value: "" },
                    ...allProducts?.map((product: any) => ({
                      label: product?.name,
                      value: product?.name,
                    })),
                  ]}
                  width="w-full"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Plan Name</label>
                <input
                  type="text"
                  placeholder="Enter plan name..."
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="Enter organization name..."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Start Date */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">
                  Purchases On
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
                    placeholderText="Select purchase date"
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Expire On</label>
                <div className="flex flex-row border-[1px] rounded-lg">
                  <CustomSelect
                    value={endFilterType}
                    onChange={setEndFilterType}
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
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    // className="h-10 px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                    className="h-10 px-3 text-sm w-full focus:outline-none"
                    placeholderText="Select expire date"
                    dateFormat="yyyy-MM-dd"
                    minDate={startDate}
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
          <h2 className="text-lg font-bold px-6">Purchase Details</h2>
          <div className="flex flex-wrap items-center gap-3">
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
          data={purchaseDetails}
          onRowClick={handleRowClick}
          isResetPage={isResetPage}
        />
      </div>
    </ValidatePermissions>
  );
}
