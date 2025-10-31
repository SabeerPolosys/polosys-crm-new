"use client";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PurchaseDetails() {
  const [purchaseDetails, setPurchaseDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const getAllPurchases = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/v1/purchase`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setPurchaseDetails(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch purchase details.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllPurchases();
  }, []);
  const columns = [
    // { header: "Product", accessor: "product" },
    // { header: "Version", accessor: "version" },
    // { header: "Purchase Date", accessor: "purchaseDate" },
    // { header: "Plan", accessor: "plan" },
    // { header: "Last Renewed Date", accessor: "planLastRenewedDate" },
    // { header: "Plan Expiry Date", accessor: "planExpireDate" },
    // { header: "Status", accessor: "planStatus" },
    // { header: "Price", accessor: "purchasePrice" },
    // { header: "Currency", accessor: "currencySymbol" },
    // { header: "Customer Name", accessor: "customerName" },
    // { header: "Auto Renew", accessor: "isAutoRenew" },
    { header: "Client Name", accessor: "clientName" },
    { header: "Country", accessor: "countryCode" },
    { header: "Currency", accessor: "currencyCode" },
    { header: "Total Price", accessor: "totalPrice" },
    {
      header: "Purchased On",
      accessor: "purchaseDate",
      specialName: "convertdatetime",
    },
    {
      header: "Status",
      accessor: "statusname",
      specialName: "status",
      colour: {
        Confirm: "bg-blue-100 text-blue-700",
        Invoiced: "bg-green-100 text-green-700",
        Cancelled: "bg-red-100 text-red-700",
        Processing: "bg-yellow-100 text-yellow-700",
        PaymentInitialized: "bg-purple-100 text-purple-700",
        Returned: "bg-orange-100 text-orange-700",
      },
    },
  ];

  const handleRowClick = (row) => {
    router.push(`/accounts/purchases/${row?.purchaseOrderID}`);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <h2 className="text-lg font-bold px-6">Purchase Details</h2>
        <DynamicTable
          columns={columns}
          data={purchaseDetails}
          onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
