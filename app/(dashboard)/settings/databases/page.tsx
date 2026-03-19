"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { DatabaseType } from "@/types/auth";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import CustomSelect from "@/components/customers/CustomSelect";
type DatabaseResponseData = {
  success: boolean;
  message: string;
  data: DatabaseType[];
};

export default function Databases() {
  const [databases, setDatabases] = useState<DatabaseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [serverName, setServerName] = useState("");
  const [dataBaseName, setDatabaseName] = useState("");
  const [productName, setProductName] = useState("");
  const [allProducts, setAllProducts] = useState<any>([]);
  const [allDatabases, setAllDatabases] = useState<DatabaseType[]>([]);
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
    const getAllDatabases = async () => {
      try {
        if (isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<DatabaseResponseData>(`/api/v1/database`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setDatabases(respose);
          setAllDatabases(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch databases.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllDatabases();
  }, [isDeleteOpen]);
  const columns = [
    { header: "Database Name", accessor: "databaseName" },
    { header: "User Limit", accessor: "userLimit" },
    { header: "Product", accessor: "productName" },
    { header: "Version", accessor: "versionNumber" },
    { header: "Server", accessor: "serverName" },
    { header: "Status", accessor: "isActive" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || [],
  );
  const handleSearch = () => {
    let filtered = [...allDatabases];

    /** ✅ Product Name */
    if (productName) {
      filtered = filtered.filter(
        (d) => d.productName?.toLowerCase() === productName.toLowerCase(),
      );
    }

    /** ✅ Server Name (partial match) */
    if (serverName.trim()) {
      const value = serverName.toLowerCase();
      filtered = filtered.filter((d) =>
        d.serverName?.toLowerCase().includes(value),
      );
    }

    /** ✅ Database Name (partial match) */
    if (dataBaseName.trim()) {
      const value = dataBaseName.toLowerCase();
      filtered = filtered.filter((d) =>
        d.databaseName?.toLowerCase().includes(value),
      );
    }

    setDatabases(filtered);
  };
  const resetFilters = () => {
    setProductName("");
    setServerName("");
    setDatabaseName("");

    setDatabases(allDatabases);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center px-6">
          <h2 className="text-lg font-bold">Databases</h2>

          <div className="flex flex-row gap-2 items-center"></div>
        </div>
        <div className="px-6">
          <div className="p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 items-end">
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
                <label className="text-xs text-slate-500 mb-1">
                  Databse Name
                </label>
                <input
                  type="text"
                  placeholder="Enter database name..."
                  value={dataBaseName}
                  onChange={(e) => setDatabaseName(e.target.value)}
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
          data={databases}
          isDataLoading={isLoading}
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
