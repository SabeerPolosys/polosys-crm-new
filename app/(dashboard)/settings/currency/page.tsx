"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Currency } from "@/types/auth";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
type CurrencyResponse = {
  success: boolean;
  message: string;
  data: Currency[];
};

export default function CurrecnyList() {
  const [currencies, setCurrencies] = useState<Currency[]>([
  {
    currencyCode: "INR",
    countryName: "India",
    symbol: "₹",
    decimalPlaces: 2
  },
  {
    currencyCode: "SAR",
    countryName: "Saudi Arabia",
    symbol: "﷼",
    decimalPlaces: 2
  },
  {
    currencyCode: "OMR",
    countryName: "Oman",
    symbol: "﷼",
    decimalPlaces: 3
  },
  {
    currencyCode: "AED",
    countryName: "United Arab Emirates",
    symbol: "د.إ",
    decimalPlaces: 2
  },
  {
    currencyCode: "QAR",
    countryName: "Qatar",
    symbol: "﷼",
    decimalPlaces: 2
  }
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
    { header: "Currency Code", accessor: "currencyCode" },
    { header: "Country Name", accessor: "countryName" },
    { header: "Symbol", accessor: "symbol" },
    { header: "Decimal Places", accessor: "decimalPlaces" }
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  const onEditClick = (row: any) => {
    router.push(`/settings/currency/update/${row?.gatewayID}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.gatewayID);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">Currency List</h2>

          <div className="flex flex-row gap-2 items-center">
            {canCreate && (
              <Link
                href="/settings/currency/create"
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Currency
              </Link>
            )}
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={currencies}
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
