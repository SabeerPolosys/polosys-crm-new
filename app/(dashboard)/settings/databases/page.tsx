"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { DatabaseType, ServerType } from "@/types/auth";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
type DatabaseResponseData = {
  success: boolean;
  message: string;
  data: DatabaseType[];
};

export default function Databases() {
  const [databases, setDatabases] = useState<DatabaseType[]>([
  {
    databaseName: "CustomerDB",
    userLimit: 100,
    isActive: true,
    product: "ERP",
    version: "v2.3",
    server: "AlphaServer"
  },
  {
    databaseName: "AnalyticsDB",
    userLimit: 50,
    isActive: false,
    product: "Books",
    version: "v1.9",
    server: "BetaNode"
  },
  {
    databaseName: "TestDB",
    userLimit: 25,
    isActive: true,
    product: "Inventory",
    version: "v3.1",
    server: "GammaCore"
  },
  {
    databaseName: "ProxyCache",
    userLimit: 40,
    isActive: true,
    product: "CRM",
    version: "v5.0",
    server: "DeltaProxy"
  },
  {
    databaseName: "SalesDB",
    userLimit: 200,
    isActive: false,
    product: "HRM",
    version: "v4.2",
    server: "OmegaDB"
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
    { header: "Database Name", accessor: "databaseName" },
    { header: "User Limit", accessor: "userLimit" },
    { header: "Product", accessor: "product" },
    { header: "Version", accessor: "version" },
    { header: "Server", accessor: "server" },
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

          <div className="flex flex-row gap-2 items-center">
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
