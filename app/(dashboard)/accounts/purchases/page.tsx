"use client";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import { useRouter } from "next/navigation";

export default function PurchaseDetails() {
  const router = useRouter();
  const columns = [
    { header: "Product", accessor: "product" },
    { header: "Version", accessor: "version" },
    { header: "Purchase Date", accessor: "purchaseDate" },
    { header: "Plan", accessor: "plan" },
    { header: "Last Renewed Date", accessor: "planLastRenewedDate" },
    { header: "Plan Expiry Date", accessor: "planExpireDate" },
    { header: "Status", accessor: "planStatus" },
    { header: "Price", accessor: "purchasePrice" },
    { header: "Currency", accessor: "currencySymbol" },
    { header: "Customer Name", accessor: "customerName" },
    { header: "Auto Renew", accessor: "isAutoRenew" },
  ];

  const data = [
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-08-03",
      plan: "Ultimate",
      planLastRenewedDate: "2025-08-03",
      planExpireDate: "2025-09-02",
      planStatus: "Active",
      customerName: "Rahul",
      purchasePrice: 1500,
      currencySymbol: "₹",
    },
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-07-15",
      plan: "Ultimate",
      planLastRenewedDate: "2025-07-15",
      planExpireDate: "2025-08-14",
      planStatus: "Expired",
      customerName: "Ayesha",
      purchasePrice: 1450,
      currencySymbol: "₹",
    },
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-09-01",
      plan: "Ultimate",
      planLastRenewedDate: "2025-09-01",
      planExpireDate: "2025-10-01",
      planStatus: "Active",
      customerName: "Rahul",
      purchasePrice: 1550,
      currencySymbol: "₹",
    },
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-08-20",
      plan: "Ultimate",
      planLastRenewedDate: "2025-08-20",
      planExpireDate: "2025-09-19",
      planStatus: "Active",
      customerName: "Fatima",
      purchasePrice: 1500,
      currencySymbol: "₹",
    },
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-06-10",
      plan: "Ultimate",
      planLastRenewedDate: "2025-06-10",
      planExpireDate: "2025-07-10",
      planStatus: "Expired",
      customerName: "John",
      purchasePrice: 1400,
      currencySymbol: "₹",
    },
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-10-01",
      plan: "Ultimate",
      planLastRenewedDate: "2025-10-01",
      planExpireDate: "2025-10-31",
      planStatus: "Active",
      customerName: "Lina",
      purchasePrice: 1600,
      currencySymbol: "₹",
    },
  ];
  const handleRowClick = () => {
    router.push(`/accounts/purchases/1`);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <h2 className="text-lg font-bold px-6">Purchase Details</h2>
        <DynamicTable
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
