"use client";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { PaymentDetails } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type GetPaymentsResponse = {
  success: boolean,
  message: string,
  data: PaymentDetails[]
}

export default function Payments() {
  const [allPayments, setAllPayments] = useState<PaymentDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const getAllPayments = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/v1/payment`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setAllPayments(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch payments details.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllPayments();
  }, []);
  const columns = [
    { header: "Payment Id", accessor: "paymentID" },
    { header: "Date", accessor: "paidOn" },
    { header: "Amount", accessor: "amountPaid" },
    { header: "Tax", accessor: "taxAmount" },
    { header: "Total", accessor: "total", specialName:"paymentTotal" },
    {
      header: "Status",
      accessor: "status",
      colour: {
        Pending: "bg-blue-100 text-blue-700",
        Paid: "bg-green-100 text-green-700",
        Failed: "bg-red-100 text-red-700",
      },
    },
    { header: "Payment Method", accessor: "paymentMode" },
    // { header: "Is Invoiced", accessor: "isInvoiced" },
    // { header: "Convert To Invoice", accessor: "converToInvoice" },
  ];

  // const handleRowClick = () => {
  //   router.push(`/accounts/payments/1`);
  // };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <h2 className="text-lg font-bold px-6">Payment Details</h2>
        <DynamicTable
          columns={columns}
          data={allPayments}
          // onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
