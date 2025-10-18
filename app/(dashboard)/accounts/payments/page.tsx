"use client";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Payments() {
  const [allPayments, setAllPayments] = useState([]);
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
    { header: "Payment Id", accessor: "paymentId" },
    { header: "Date", accessor: "date" },
    { header: "Amount", accessor: "amount" },
    { header: "Tax", accessor: "tax" },
    { header: "Total", accessor: "total" },
    {
      header: "Status",
      accessor: "status",
      colour: {
        Pending: "bg-blue-100 text-blue-700",
        Success: "bg-green-100 text-green-700",
        Failed: "bg-red-100 text-red-700",
      },
    },
    { header: "Payment Method", accessor: "paymentMethod" },
    { header: "Is Invoiced", accessor: "isInvoiced" },
    { header: "Convert To Invoice", accessor: "converToInvoice" },
  ];

  const data = [
    {
      paymentId: "PAY-2001",
      date: "2025-08-01",
      amount: 1450,
      tax: 145,
      total: 1595,
      status: "Pending",
      paymentMethod: "Credit Card",
      isInvoiced: false,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2002",
      date: "2025-08-03",
      amount: 920,
      tax: 92,
      total: 1012,
      status: "Success",
      paymentMethod: "Bank Transfer",
      isInvoiced: true,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2003",
      date: "2025-08-05",
      amount: 610,
      tax: 61,
      total: 671,
      status: "Pending",
      paymentMethod: "PayPal",
      isInvoiced: false,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2004",
      date: "2025-08-06",
      amount: 980,
      tax: 98,
      total: 1078,
      status: "Pending",
      paymentMethod: "Cash",
      isInvoiced: false,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2005",
      date: "2025-08-07",
      amount: 1580,
      tax: 158,
      total: 1738,
      status: "Success",
      paymentMethod: "Credit Card",
      isInvoiced: false,
      converToInvoice: true,
    },
    {
      paymentId: "PAY-2006",
      date: "2025-08-08",
      amount: 820,
      tax: 82,
      total: 902,
      status: "Pending",
      paymentMethod: "Bank Transfer",
      isInvoiced: false,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2007",
      date: "2025-08-09",
      amount: 1190,
      tax: 119,
      total: 1309,
      status: "Success",
      paymentMethod: "Credit Card",
      isInvoiced: false,
      converToInvoice: true,
    },
    {
      paymentId: "PAY-2008",
      date: "2025-08-10",
      amount: 470,
      tax: 47,
      total: 517,
      status: "Pending",
      paymentMethod: "PayPal",
      isInvoiced: false,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2009",
      date: "2025-08-11",
      amount: 1630,
      tax: 163,
      total: 1793,
      status: "Success",
      paymentMethod: "UPI",
      isInvoiced: true,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2010",
      date: "2025-08-12",
      amount: 940,
      tax: 94,
      total: 1034,
      status: "Failed",
      paymentMethod: "Bank Transfer",
      isInvoiced: false,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2011",
      date: "2025-08-13",
      amount: 730,
      tax: 73,
      total: 803,
      status: "Success",
      paymentMethod: "Credit Card",
      isInvoiced: true,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2012",
      date: "2025-08-14",
      amount: 860,
      tax: 86,
      total: 946,
      status: "Pending",
      paymentMethod: "Cash",
      isInvoiced: false,
      converToInvoice: false,
    },
    {
      paymentId: "PAY-2013",
      date: "2025-08-15",
      amount: 1410,
      tax: 141,
      total: 1551,
      status: "Failed",
      paymentMethod: "UPI",
      isInvoiced: false,
      converToInvoice: false,
    },
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
          data={data}
          // onRowClick={handleRowClick}
        />
      </div>
    </ValidatePermissions>
  );
}
