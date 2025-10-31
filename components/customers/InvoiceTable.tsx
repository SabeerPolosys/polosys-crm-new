"use client"
import { LiaFileInvoiceSolid } from "react-icons/lia";
import DynamicTableType2 from "../table/DynamicTableType2";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { showToast } from "../common/ShowToast";
import { useRouter } from "next/navigation";
type GetInvoicesResponse = {
  success: boolean;
  message: string;
  data: any[];
};

export default function InvoiceTable({customerId}: {customerId: string}) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    const getCustomerInvoices = async () => {
      try {
        if (!customerId) return;
        const res = await api.get<GetInvoicesResponse>(
          `/api/v1/invoice/InvoiceDetailsByClient/${customerId}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setInvoices(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch customer invoices.`,
          type: "error",
        });
      }
    };
    getCustomerInvoices();
  }, [customerId]);
  const columns = [
    { header: "Invoice Number", accessor: "invoiceNumber" },
    { header: "Date", accessor: "date",  specialName:"convertDateTime"},
    { header: "Amount", accessor: "amount" },
    { header: "Tax", accessor: "taxAmount" },
    { header: "Total", accessor: "total" },
    { header: "Payment Id", accessor: "transactionRef" },
    { header: "Invoiced Date", accessor: "invoiceDate", specialName:"convertDateTime" },
  ];

  const handleRowClick = (row) => {
    router.push(`/accounts/invoices/${row?.invoiceID}`);
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="flex flex-row gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-[1px] border-gray-300">
          <LiaFileInvoiceSolid className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Invoice History</h2>
      </div>
      <DynamicTableType2 columns={columns} data={invoices} onRowClick={handleRowClick}/>
    </div>
  );
}
