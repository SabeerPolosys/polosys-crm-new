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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomSelect from "@/components/customers/CustomSelect";
import { useSearchParams } from "next/navigation";
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

  const [planStatus, setPlanStatus] = useState("");
  const [customerStatus, setCustomerStatus] = useState("");
  const [productName, setProductName] = useState("");
  const [planName, setPlanName] = useState("");
  const [country, setCountry] = useState("");
  const [allContries, setAllContries] = useState<any>([]);
  const [allProducts, setAllProducts] = useState<any>([]);
  const [organiztionName, setOrganizationName] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [startFilterType, setStartFilterType] = useState("eq");
  const [endFilterType, setEndFilterType] = useState("eq");
  const [pageDetails, setPageDetails] = useState({ limit: 10, page: 1 });
  const [isResetPage, setIsResetPage] = useState(1);
  const searchParams = useSearchParams();
  useEffect(() => {
    const planStatusParam = searchParams.get("planStatus") || "";
    const customerStatusParam = searchParams.get("customerStatus") || "";
    const countryParam = searchParams.get("country") || "";
    const productParam = searchParams.get("productName") || "";
    const planNameParam = searchParams.get("planName") || "";
    const searchParam = searchParams.get("search") || "";

    const startDateParam = searchParams.get("startDate");
    const startTypeParam = searchParams.get("startType") || "eq";

    const endDateParam = searchParams.get("endDate");
    const endTypeParam = searchParams.get("endType") || "eq";

    setPlanStatus(planStatusParam);
    setCustomerStatus(customerStatusParam);
    setCountry(countryParam);
    setProductName(productParam);
    setPlanName(planNameParam);
    setOrganizationName(searchParam);

    if (startDateParam) setStartDate(new Date(startDateParam));
    if (endDateParam) setEndDate(new Date(endDateParam));

    setStartFilterType(startTypeParam);
    setEndFilterType(endTypeParam);
  }, []);
  useEffect(() => {
    if (allCustomers.length) {
      searchCustomer();
    }
  }, [allCustomers]);
  const updatePageDetails = (limit: number, page: number) => {
    setPageDetails({ limit, page });
  };
  const resetFilters = () => {
    setPlanStatus("");
    setCustomerStatus("");
    setSearchKey("organizationName");
    setSearchValue("");
    setCountry("");
    setStartDate(null);
    setEndDate(null);
    setProductName("");
    setPlanName("");
    setOrganizationName("");
    setStartFilterType("eq");
    setEndFilterType("eq");
    setCustomerDetails(allCustomers);
    router.push("/customers");
  };
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
  const router = useRouter();
  const columns = [
    { header: "Organization Name", accessor: "organizationName" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Email", accessor: "email" },
    { header: "Country", accessor: "countryName" },
    { header: "Status", accessor: "isActive", specialName: "booleanStatus" },
    { header: "Product Name", accessor: "name" },
    { header: "Plan Name", accessor: "planName" },
    {
      header: "Start Date",
      accessor: "startDate",
      specialName: "convertdate",
    },
    { header: "End Date", accessor: "endDate", specialName: "convertdate" },
    { header: "Type", accessor: "typeName" },
    // { header: "Is Paid", accessor: "statusName" },
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
          searchCustomer(respose || []);
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
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (pageDetails?.limit) {
      params.set("limit", pageDetails.limit.toString());
    }

    if (pageDetails?.page) {
      params.set("page", pageDetails.page.toString());
    }
    router.push(`?${params.toString()}`);
  }, [pageDetails]);

  const handleRowClick = (rowData: any) => {
    const params = searchParams.toString();

    router.push(`/customers/${rowData.clientID}?${params.toString()}`);
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
  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const applyDateFilter = (
    data: CustomerDetails[],
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

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (planStatus) params.set("planStatus", planStatus);
    if (customerStatus) params.set("customerStatus", customerStatus);
    if (country) params.set("country", country);
    if (productName) params.set("productName", productName);
    if (planName.trim()) params.set("planName", planName);
    if (organiztionName.trim()) params.set("search", organiztionName);

    if (startDate) {
      params.set("startDate", startDate.toISOString());
      params.set("startType", startFilterType);
    }

    if (endDate) {
      params.set("endDate", endDate.toISOString());
      params.set("endType", endFilterType);
    }

    router.push(`?${params.toString()}`);
    setIsResetPage(prev=>prev+1);
    searchCustomer();
  };

  const searchCustomer = (respose?: CustomerDetails[]) => {
    let filtered = respose ? [...respose] : [...allCustomers];
    /** ✅ Plan Status */
    if (planStatus) {
      filtered = filtered.filter((c) =>
        planStatus === "Expired"
          ? getExpiryStatus(c.endDate) === "expired"
          : c.typeName === planStatus,
      );
    }

    /** ✅ Customer Status */
    if (customerStatus) {
      filtered = filtered.filter((c) =>
        customerStatus === "Active" ? c.isActive : !c.isActive,
      );
    }

    /** ✅ Country */
    if (country) {
      filtered = filtered.filter((c) => c.countryID === country);
    }

    /** ✅ Product */
    if (productName) {
      filtered = filtered.filter((c) => c.name === productName);
    }

    /** ✅ Plan Name */
    if (planName.trim()) {
      filtered = filtered.filter((c) =>
        c.planName?.toLowerCase().includes(planName.toLowerCase()),
      );
    }

    /** ✅ Organization / Email */
    if (organiztionName.trim()) {
      const value = organiztionName.toLowerCase();

      filtered = filtered.filter(
        (c) =>
          c.organizationName?.toLowerCase().includes(value) ||
          c.email?.toLowerCase().includes(value),
      );
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

    setCustomerDetails(filtered);
  };

  return (
    <ValidatePermissions>
      <div className="rounded-lg py-6 bg-white">
        <div className="px-6 mb-2 flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold">Customers</h2>
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
                    { label: "Demo", value: "Demo" },
                    { label: "Registered", value: "Registered" },
                    { label: "Expired", value: "Expired" },
                  ]}
                  width="w-full"
                />
              </div>

              {/* User Status */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">
                  User Status
                </label>
                <CustomSelect
                  value={customerStatus}
                  onChange={setCustomerStatus}
                  placeholder="All"
                  options={[
                    { label: "All", value: "" },
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                  width="w-full"
                />
              </div>

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

        <DynamicTable
          columns={columns}
          data={customerDetails}
          onRowClick={handleRowClick}
          updatePageDetails={updatePageDetails}
          page={searchParams.get("page")}
          limit={searchParams.get("limit")}
          isResetPage={isResetPage}
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
              // statusID: updateCustomer?.statusID === 11 ? 4 : 11,
              isActive: !updateCustomer?.isActive,
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
