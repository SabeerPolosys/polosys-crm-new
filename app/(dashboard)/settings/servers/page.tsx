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
  const [servers, setServers] = useState<ServerType[]>([
  {
    serverName: "AlphaServer",
    Region: "United States",
    ip: "192.168.0.1",
    remarks: "Primary server",
    isActive: true,
    databaseLimit: 10
  },
  {
    serverName: "BetaNode",
    Region: "Germany",
    ip: "192.168.0.2",
    remarks: "Backup server",
    isActive: false,
    databaseLimit: 8
  },
  {
    serverName: "GammaCore",
    Region: "Japan",
    ip: "10.0.0.1",
    remarks: "Testing environment",
    isActive: true,
    databaseLimit: 3
  },
  {
    serverName: "DeltaProxy",
    Region: "Canada",
    ip: "172.16.0.10",
    remarks: "Proxy server",
    isActive: true,
    databaseLimit: 6
  },
  {
    serverName: "OmegaDB",
    Region: "Brazil",
    ip: "192.168.10.5",
    remarks: "Database server",
    isActive: false,
    databaseLimit: 12
  },
]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();
//   useEffect(() => {
//     const getAllAddons = async () => {
//       try {
//         if (isDeleteOpen) return;
//         setIsLoading(true);
//         const res = await api.get<PaymentGatewayResponse>(
//           `/api/v1/payment-gateway`
//         );
//         if (res?.data?.success) {
//           const respose = res?.data?.data;
//           setPaymentGateways(respose);
//         }
//       } catch {
//         showToast({
//           message: `Failed to fetch addons.`,
//           type: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     getAllAddons();
//   }, [isDeleteOpen]);
  const columns = [
    { header: "Server Name", accessor: "serverName" },
    { header: "Region", accessor: "Region" },
    { header: "IP", accessor: "ip" },
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
    router.push(`/settings/servers/update/${row?.gatewayID}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.gatewayID);
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
