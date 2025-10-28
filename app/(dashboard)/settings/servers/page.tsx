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
type ServerResponseData = {
  success: boolean;
  message: string;
  data: ServerType[];
};

export default function Servers() {
  const [servers, setServers] = useState<ServerType[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const getAllServers = async () => {
      try {
        if (isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<ServerResponseData>(
          `/api/v1/server`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setServers(respose);
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
    { header: "Region", accessor: "Region" },
    { header: "IP", accessor: "ipAddress" },
    { header: "Remarks", accessor: "remarks" },
    { header: "Status", accessor: "isActive" },
    { header: "Database Limit", accessor: "databaseLimit" }
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  const onEditClick = (row: any) => {
    router.push(`/settings/servers/update/${row?.serverID}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.serverID);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">Servers</h2>

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
