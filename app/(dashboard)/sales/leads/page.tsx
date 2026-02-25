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
  const [searchKey, setSearchKey] = useState("fullName");
  const [searchValue, setSearchValue] = useState("");
  const [demoStatus, setDemoStatus] = useState("");
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
    { header: "Full Name", accessor: "fullName" },
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
  const searchDeals = () => {
    let filtered = [...allLeads];

    /** ✅ Status Filter */
    if (demoStatus) {
      filtered = filtered.filter((lead: any) => {
        const status = getLeadStatus(lead.endDate);
        return status === demoStatus;
      });
    }

    /** ✅ Field Search */
    if (searchKey && searchValue.trim()) {
      const value = searchValue.toLowerCase();

      filtered = filtered.filter((lead: any) => {
        const fieldValue = lead?.[searchKey];
        if (!fieldValue) return false;

        return String(fieldValue).toLowerCase().includes(value);
      });
    }

    setLeads(filtered);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title */}
          <h2 className="text-xl font-semibold text-slate-800">All Leads</h2>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Demo Status Filter */}
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

            {/* Search Type */}
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
              onClick={searchDeals}
              className="h-10 px-4 bg-gray-700 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-gray-900 transition cursor-pointer"
            >
              Search
            </button>

            {/* Export Button */}
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
        </div>
        <DynamicTable
          columns={columns}
          data={leads}
          setUpdateStatus={setUpdateStatus}
        />
      </div>
    </ValidatePermissions>
  );
}
