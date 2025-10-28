"use client";
import { BsCart3 } from "react-icons/bs";
import DynamicTableType2 from "../table/DynamicTableType2";
import { useEffect, useState } from "react";
import { showToast } from "../common/ShowToast";
import { PaymentDetails } from "@/types/auth";
import api from "@/lib/axios";
type GetPaymentsResponse = {
  success: boolean;
  message: string;
  data: PaymentDetails[];
};

export default function PaymentTable({
  customerId,
}: {
  customerId: string | undefined;
}) {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  useEffect(() => {
    const getCustomerPaymentDetails = async () => {
      try {
        if (!customerId) return;
        const res = await api.get<GetPaymentsResponse>(
          `/api/v1/payment/PaymentDetailsByClientID/${customerId}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setPayments(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch customer payments.`,
          type: "error",
        });
      }
    };
    getCustomerPaymentDetails();
  }, [customerId]);
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

  return (
    <div className="bg-gray-50 p-4">
      <div className="flex flex-row gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-[1px] border-gray-300">
          <BsCart3 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Payment History</h2>
      </div>
      <DynamicTableType2 columns={columns} data={payments} />
    </div>
  );
}
