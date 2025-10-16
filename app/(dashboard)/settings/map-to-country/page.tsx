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

export default function MappingCurrencyOrGateway() {
  const [databases, setDatabases] = useState<any[]>([
    {
      countryName: "India",
      gateways: "Razorpay, PhonePay",
      currencies: "INR, SAR",
    },
    {
      countryName: "Saudi",
      gateways: "Razorpay, PhonePay",
      currencies: "INR, SAR",
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
    { header: "Country Name", accessor: "countryName" },
    { header: "Payment Gateways", accessor: "gateways" },
    { header: "Currencies", accessor: "currencies" },
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
          <h2 className="text-lg font-bold px-6">
            Gateway Or Currecny Mapping
          </h2>

          <div className="flex flex-row gap-2 items-center">
            <Link
              href="/settings/map-to-country/create"
              className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
            >
              {" "}
              + &nbsp; Create Mapping
            </Link>
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={databases}
          isDataLoading={isLoading}
          isEditAllowed={true}
          isDeleteAllowed={true}
          onEditClick={()=>{}}
          onDeleteClick={()=>{}}
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
