"use client";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { InvoiceDetails } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type GetInvoicesResponse = {
  success: boolean;
  message: string;
  data: InvoiceDetails[];
};

export default function Invoices() {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails[]>([]);
  const router = useRouter();
  const columns = [
    { header: "Customer Name", accessor: "organizationName", onValueClick:(e:any, row:any)=>{e.stopPropagation();router.push(`/customers/${row?.clientID}`);}},
    { header: "Invoice Number", accessor: "invoiceNumber" },
    { header: "Date", accessor: "date",  specialName:"convertDateTime"},
    { header: "Amount", accessor: "amount" },
    { header: "Tax", accessor: "taxAmount" },
    { header: "Total", accessor: "total" },
    { header: "Payment Id", accessor: "transactionRef" },
    { header: "Invoiced Date", accessor: "invoiceDate", specialName:"convertDateTime" },
  ];
  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        const res = await api.get<GetInvoicesResponse>(`/api/v1/invoice`);
        if (res?.data?.success) {
          const response = res?.data?.data;
          setInvoiceDetails(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch invoices.`,
          type: "error",
        });
      }
    };
    getAllInvoices();
  }, []);

  const handleRowClick = (row) => {
    router.push(`/accounts/invoices/${row?.invoiceID}`);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <h2 className="text-lg font-bold px-6">Invoices</h2>
        <DynamicTable
          columns={columns}
          data={invoiceDetails}
          onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
