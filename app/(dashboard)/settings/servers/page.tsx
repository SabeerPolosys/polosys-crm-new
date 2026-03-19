"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ServerType } from "@/types/auth";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import CustomSelect from "@/components/customers/CustomSelect";
type ServerResponseData = {
  success: boolean;
  message: string;
  data: ServerType[];
};

export default function Servers() {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [allServers, setAllServers] = useState<ServerType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [country, setCountry] = useState("");
  const [allContries, setAllContries] = useState<any>([]);
  const [serverName, setServerName] = useState("");
  const [region, setRegion] = useState("");
  const [serverStatus, setServerStatus] = useState("");
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
    const getAllServers = async () => {
      try {
        if (isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<ServerResponseData>(`/api/v1/server`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setServers(respose);
          setAllServers(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch servers.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllServers();
  }, [isDeleteOpen]);
  const columns = [
    { header: "Server Name", accessor: "serverName" },
    { header: "Region", accessor: "region" },
    { header: "IP", accessor: "ipAddress" },
    { header: "Remarks", accessor: "remarks" },
    { header: "Status", accessor: "isActive" },
    { header: "Database Limit", accessor: "databaseLimit" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || [],
  );
  const onEditClick = (row: any) => {
    router.push(`/settings/servers/update/${row?.serverID}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.serverID);
  };
  const handleSearch = () => {
    let filtered = [...allServers];

    /** ✅ Server Status */
    if (serverStatus) {
      const status = serverStatus === "true";
      filtered = filtered.filter((s) => s.isActive === status);
    }

    /** ✅ Region (Country dropdown) */
    if (country) {
      filtered = filtered.filter((s) => s.region === country);
    }

    /** ✅ Server Name */
    if (serverName.trim()) {
      const value = serverName.toLowerCase();
      filtered = filtered.filter((s) =>
        s.serverName?.toLowerCase().includes(value),
      );
    }

    /** ✅ IP Address */
    if (region.trim()) {
      const value = region.toLowerCase();
      filtered = filtered.filter((s) =>
        s.ipAddress?.toLowerCase().includes(value),
      );
    }

    setServers(filtered);
  };
  const resetFilters = () => {
    setServerStatus("");
    setCountry("");
    setServerName("");
    setRegion("");

    setServers(allServers);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center px-6 mb-2">
          <h2 className="text-lg font-bold">Servers</h2>

          <div className="flex flex-row gap-2 items-center">
            {canCreate && (
              <Link
                href="/settings/servers/create"
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Server
              </Link>
            )}
          </div>
        </div>
        <div className="px-6">
          <div className="p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">
                  Sever Status
                </label>
                <CustomSelect
                  value={serverStatus}
                  onChange={setServerStatus}
                  placeholder="All"
                  options={[
                    { label: "All", value: "" },
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]}
                  width="w-full"
                />
              </div>
              {/* Country */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Region</label>
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
                  Server Name
                </label>
                <input
                  type="text"
                  placeholder="Enter server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Server Ip</label>
                <input
                  type="text"
                  placeholder="Enter server Ip..."
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="h-10 w-full px-3 border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
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
          data={servers}
          isDataLoading={isLoading}
          isEditAllowed={true}
          isDeleteAllowed={true}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Server"
          deleteId={`?serverId=${deleteId}` as string}
          deleteUrl={"/api/v1/server"}
          redirectUrl={"/settings/servers"}
        />
      </div>
    </ValidatePermissions>
  );
}
