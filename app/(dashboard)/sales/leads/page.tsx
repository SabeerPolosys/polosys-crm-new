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
type GetLeadResponse = {
  success: boolean;
  message: string;
  data: LeadsType[];
};

export default function Leads() {
  const [leads, setLeads] = useState<LeadsType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getAllLeads = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<GetLeadResponse>(`/api/v1/leads`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setLeads(respose || []);
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
  }, []);
  const columns = [
    { header: "Full Name", accessor: "fullName" },
    { header: "Country", accessor: "countryName" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Source", accessor: "source" },
    {
      header: "Status",
      accessor: "status",
      specialName: "changeableStatus",
      isConvert: true,
      isFor: "leadStatus",
      updateKey: "status",
      colour: {
        New: "bg-gray-200 text-gray-700",
        Contacted: "bg-blue-100 text-blue-700",
        Quoted: "bg-green-100 text-green-700",
        Lost: "bg-red-100 text-red-700",
        Pending: "bg-orange-100 text-orange-700",
      },
      options: [
        { key: "41", value: "New" },
        { key: "42", value: "Contacted" },
        { key: "43", value: "Quoted" },
        { key: "44", value: "Lost" },
        { key: "45", value: "Pending" },
      ],
      onUpdate: async (data: any) => {
        try {
          const res = await api.put(`/api/v1/leads`, data);
          showToast({
            message: `Status updated successfully.`,
            type: "success",
          });
          return true;
        } catch {
          showToast({
            message: `Failed to update status.`,
            type: "error",
          });
          return false;
        }
      },
    },
    {
      header: "Priority Level",
      accessor: "level",
      specialName: "changeableStatus",
      defaultValue: "Warm",
      isFor: "leadStatus",
      updateKey: "priority",
      colour: {
        Cold: "bg-blue-200 text-blue-800",
        Warm: "bg-yellow-200 text-yellow-800",
        Hot: "bg-red-200 text-red-800",
      },
      options: [
        { value: "Hot", key: "Hot" },
        { value: "Cold", key: "Cold" },
        { value: "Warm", key: "Warm" },
      ],
      onUpdate: async (data: any) => {
        try {
          const res = await api.put(`/api/v1/leads`, data);
          showToast({
            message: `Priority level updated successfully.`,
            type: "success",
          });
          return true;
        } catch {
          showToast({
            message: `Failed to update priority level.`,
            type: "error",
          });
          return false;
        }
      },
    },
    // { header: "Assigned To", accessor: "assignto" },
    // { header: "Assign", accessor: "assignto1" },
    // { header: "Convert To Deal", accessor: "convertToDeal" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">All Leads</h2>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex items-center gap-2 border border-gray-400 rounded px-4 py-1 text-xs text-gray-400">
              {/* Rounded dot */}
              <span className="w-2 h-2 rounded-full bg-red-500"></span>

              {/* Text content */}
              <span>Hot level</span>

              {/* Number */}
              <span className="text-lg text-gray-600">&nbsp;151</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-400 rounded px-4 py-1 text-xs text-gray-400">
              {/* Rounded dot */}
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>

              {/* Text content */}
              <span>Warm level</span>

              {/* Number */}
              <span className="text-lg text-gray-600">&nbsp;283</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-400 rounded px-4 py-1 text-xs text-gray-400">
              {/* Rounded dot */}
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>

              {/* Text content */}
              <span>Cold level</span>

              {/* Number */}
              <span className="text-lg text-gray-600">&nbsp;89</span>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
              {" "}
              <SlCalender /> Monthly
            </button>
            <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
              {" "}
              <FaRegFileAlt /> Export details
            </button>
            {/* {canCreate && (
              <button className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs">
                {" "}
                + &nbsp; Add Lead
              </button>
            )} */}
          </div>
        </div>
        <DynamicTable columns={columns} data={leads} />
      </div>
    </ValidatePermissions>
  );
}
