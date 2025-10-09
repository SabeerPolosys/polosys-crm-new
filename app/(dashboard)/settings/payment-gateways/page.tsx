"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { PaymentGateway } from "@/types/auth";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
type PaymentGatewayResponse = {
  success: boolean;
  message: string;
  data: PaymentGateway[];
};

export default function PaymentGatewayList() {
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const getAllAddons = async () => {
      try {
        if (isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<PaymentGatewayResponse>(
          `/api/v1/payment-gateway`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setPaymentGateways(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch addons.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllAddons();
  }, [isDeleteOpen]);
  const columns = [
    { header: "Provider Name", accessor: "providerName" },
    { header: "Api Key", accessor: "apiKey" },
    { header: "Endpoint Url", accessor: "endpointURL" },
    { header: "Supported Modes", accessor: "supportedModes" },
    { header: "Status", accessor: "isActive" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  const onEditClick = (row: any) => {
    router.push(`/settings/payment-gateways/update/${row?.gatewayID}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.gatewayID);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">Payment Gateways</h2>

          <div className="flex flex-row gap-2 items-center">
            {canCreate && (
              <Link
                href="/settings/payment-gateways/create"
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Payment Gateway
              </Link>
            )}
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={paymentGateways}
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
          deleteLabel="Payment Gateway"
          deleteId={`?paymentGatewayId=${deleteId}` as string}
          deleteUrl={"/api/v1/payment-gateway"}
          redirectUrl={"/settings/payment-gateways"}
        />
      </div>
    </ValidatePermissions>
  );
}
