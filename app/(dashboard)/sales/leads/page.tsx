"use client";
import DynamicTable from "@/components/table/DynamicTable";
import { SlCalender } from "react-icons/sl";
import { FaRegFileAlt } from "react-icons/fa";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { showToast } from "@/components/common/ShowToast";
import { LeadsType } from "@/types/auth";
import DownloadCsv from "@/components/common/DownloadCsv";
import { FiChevronDown } from "react-icons/fi";
import CustomSelect from "@/components/customers/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
type GetLeadResponse = {
  success: boolean;
  message: string;
  data: LeadsType[];
};

export default function Leads() {
  const [leads, setLeads] = useState<LeadsType[]>([]);
  const [allLeads, setAllLeads] = useState<LeadsType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(1);
  const [country, setCountry] = useState("");
  const [organiztionName, setOrganizationName] = useState("");
  const [productName, setProductName] = useState("");
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [startFilterType, setStartFilterType] = useState("eq");
  const [endFilterType, setEndFilterType] = useState("eq");
  const [planStatus, setPlanStatus] = useState("");
  const [isResetPage, setIsResetPage] = useState(1);
  const [allContries, setAllContries] = useState<any>([]);
  const [allProducts, setAllProducts] = useState<any>([]);
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
    const getAllLeads = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<GetLeadResponse>(`/api/v1/leads/DemoClients`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setLeads(respose || []);
          setAllLeads(respose || []);
        }
      } catch {
        showToast({
          message: `Failed to fetch leads.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllLeads();
  }, [updateStatus]);
  const columns = [
    { header: "Organization Name", accessor: "fullName" },
    { header: "Country", accessor: "countryName" },
    { header: "Email", accessor: "email" },
    { header: "Product Name", accessor: "productName" },
    { header: "Plan Name", accessor: "planName" },
    { header: "Start Date", accessor: "startDate", specialName: "convertdate" },
    { header: "End Date", accessor: "endDate", specialName: "convertdate" },
    {
      header: "Days Remaining",
      accessor: "endDate",
      specialName: "showRemainDate",
    },
    // { header: "Phone", accessor: "mobile" },
    // { header: "Source", accessor: "source" },
    // {
    //   header: "Status",
    //   accessor: "status",
    //   specialName: "changeableStatus",
    //   isConvert: true,
    //   isFor: "leadStatus",
    //   updateKey: "status",
    //   colour: {
    //     41: "bg-gray-200 text-gray-700",
    //     42: "bg-blue-100 text-blue-700",
    //     43: "bg-green-100 text-green-700",
    //     44: "bg-red-100 text-red-700",
    //     45: "bg-orange-100 text-orange-700",
    //   },
    //   options: [
    //     { key: "41", value: "New" },
    //     { key: "42", value: "Contacted" },
    //     { key: "43", value: "Quoted" },
    //     { key: "44", value: "Lost" },
    //     { key: "45", value: "Pending" },
    //   ],
    //   onUpdate: async (data: any) => {
    //     try {
    //       const res = await api.put(`/api/v1/leads`, data);
    //       showToast({
    //         message: `Status updated successfully.`,
    //         type: "success",
    //       });
    //       return true;
    //     } catch {
    //       showToast({
    //         message: `Failed to update status.`,
    //         type: "error",
    //       });
    //       return false;
    //     }
    //   },
    // },
    // {
    //   header: "Priority Level",
    //   accessor: "priority",
    //   specialName: "changeableStatus",
    //   defaultValue: "Warm",
    //   isFor: "leadStatus",
    //   updateKey: "priority",
    //   colour: {
    //     Cold: "bg-blue-200 text-blue-800",
    //     Warm: "bg-yellow-200 text-yellow-800",
    //     Hot: "bg-red-200 text-red-800",
    //   },
    //   options: [
    //     { value: "Hot", key: "Hot" },
    //     { value: "Cold", key: "Cold" },
    //     { value: "Warm", key: "Warm" },
    //   ],
    //   onUpdate: async (data: any) => {
    //     try {
    //       const res = await api.put(`/api/v1/leads`, data);
    //       showToast({
    //         message: `Priority level updated successfully.`,
    //         type: "success",
    //       });
    //       return true;
    //     } catch {
    //       showToast({
    //         message: `Failed to update priority level.`,
    //         type: "error",
    //       });
    //       return false;
    //     }
    //   },
    // },
    // { header: "Assigned To", accessor: "assignto" },
    // { header: "Assign", accessor: "assignto1" },
    // { header: "Convert To Deal", accessor: "convertToDeal" },
  ];

  const csvHeaders = [
    { label: "Full Name", key: "fullName" },
    { label: "Country", key: "countryName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "mobile" },
    { label: "Source", key: "source" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || [],
  );
  const getLeadStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    return "active";
  };
  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const applyDateFilter = (
    data: LeadsType[],
    field: "startDate" | "endDate",
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

  const getPlanStatus = (endDate: string) => {
    if (!endDate) return "expired";

    const today = new Date();
    const expiry = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    return expiry < today ? "expired" : "active";
  };

  const searchDeals = () => {
    let filtered = [...allLeads];

    /** ✅ Country */
    if (country) {
      filtered = filtered.filter((l) => l.countryID === country);
    }

    /** ✅ Product */
    if (productName) {
      filtered = filtered.filter((l) => l.productName === productName);
    }

    /** ✅ Plan Name */
    if (planName.trim()) {
      const value = planName.toLowerCase();
      filtered = filtered.filter((l) =>
        l.planName?.toLowerCase().includes(value),
      );
    }

    /** ✅ Organization / Email */
    if (organiztionName.trim()) {
      const value = organiztionName.toLowerCase();

      filtered = filtered.filter(
        (l) =>
          l.fullName?.toLowerCase().includes(value) ||
          l.email?.toLowerCase().includes(value),
      );
    }

    /** ✅ Plan Status (Active / Expired) */
    if (planStatus) {
      filtered = filtered.filter((l) => {
        const status = getPlanStatus(l.endDate);
        return status === planStatus.toLowerCase();
      });
    }

    /** ✅ Start Date */
    filtered = applyDateFilter(
      filtered,
      "startDate",
      startFilterType,
      startDate,
    );

    /** ✅ End Date */
    filtered = applyDateFilter(filtered, "endDate", endFilterType, endDate);
    setIsResetPage(prev=>prev+1);
    setLeads(filtered);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="px-6 mb-2 flex flex-row justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">All Leads</h2>
          <DownloadCsv
            data={leads}
            headers={csvHeaders}
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
                  Organization Name or Email
                </label>
                <input
                  type="text"
                  placeholder="Enter organization name..."
                  value={organiztionName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Start Date */}
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
                    placeholderText="Select start date"
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">End Date</label>
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
                    placeholderText="Select end date"
                    dateFormat="yyyy-MM-dd"
                    minDate={startDate}
                  />
                </div>
              </div>
              {/* Plan Status */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">
                  Plan Status
                </label>
                <CustomSelect
                  value={planStatus}
                  onChange={setPlanStatus}
                  placeholder="All"
                  options={[
                    { label: "All", value: "" },
                    { label: "Active", value: "Active" },
                    { label: "Expired", value: "Expired" },
                  ]}
                  width="w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={searchDeals}
                  className="h-10 px-5 bg-gray-800 text-white rounded-lg text-sm font-medium shadow hover:bg-gray-900 transition cursor-pointer"
                >
                  Search
                </button>

                <button
                  // onClick={resetFilters}
                  className="h-10 px-5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-10 shadow-sm">
              <label className="text-sm text-slate-500">Demo Status</label>

              <div className="relative ml-4">
                <select
                  value={demoStatus}
                  onChange={(e) => setDemoStatus(e.target.value)}
                  className="text-sm bg-transparent pr-6 focus:outline-none appearance-none p-2"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
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
                <option value="fullName">Full Name</option>
                <option value="email">Email</option>
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
              onClick={searchDeals}
              className="h-10 px-4 bg-gray-700 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-gray-900 transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </div> */}
        <DynamicTable
          columns={columns}
          data={leads}
          setUpdateStatus={setUpdateStatus}
          isResetPage={isResetPage}
        />
      </div>
    </ValidatePermissions>
  );
}
