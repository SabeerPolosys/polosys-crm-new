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
  useEffect(() => {
    const getAllDatabases = async () => {
      try {
        if (isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<DatabaseResponseData>(`/api/v1/database`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setDatabases(respose);
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
    permissions || []
  );
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">Databases</h2>

          <div className="flex flex-row gap-2 items-center"></div>
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
