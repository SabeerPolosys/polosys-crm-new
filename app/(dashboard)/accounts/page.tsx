"use client"
import DynamicTable from "@/components/table/DynamicTable";
import { useRouter } from "next/navigation";


export default function Accounts() {
  const router = useRouter();
  const columns = [
  { header: 'Invoice Number', accessor: 'invoiceNumber' },
  { header: 'Date', accessor: 'date' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Tax', accessor: 'tax' },
  { header: 'Total', accessor: 'total' },
  { header: 'Status', accessor: 'status' },
  { header: 'Payment Method', accessor: 'paymentMethod' },
];

const data = [
  {
    invoiceNumber: 'INV-1001',
    date: '2025-08-01',
    amount: 1200,
    tax: 120,
    total: 1320,
    status: 'Pending',
    paymentMethod: 'Credit Card',
  },
  {
    invoiceNumber: 'INV-1002',
    date: '2025-08-03',
    amount: 850,
    tax: 85,
    total: 935,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoiceNumber: 'INV-1003',
    date: '2025-08-05',
    amount: 500,
    tax: 50,
    total: 550,
    status: 'Overdue',
    paymentMethod: 'PayPal',
  },
  {
    invoiceNumber: 'INV-1004',
    date: '2025-08-06',
    amount: 960,
    tax: 96,
    total: 1056,
    status: 'Pending',
    paymentMethod: 'Cash',
  },
  {
    invoiceNumber: 'INV-1005',
    date: '2025-08-07',
    amount: 1430,
    tax: 143,
    total: 1573,
    status: 'Paid',
    paymentMethod: 'Credit Card',
  },
  {
    invoiceNumber: 'INV-1006',
    date: '2025-08-08',
    amount: 780,
    tax: 78,
    total: 858,
    status: 'Overdue',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoiceNumber: 'INV-1007',
    date: '2025-08-09',
    amount: 1120,
    tax: 112,
    total: 1232,
    status: 'Paid',
    paymentMethod: 'Credit Card',
  },
  {
    invoiceNumber: 'INV-1008',
    date: '2025-08-10',
    amount: 430,
    tax: 43,
    total: 473,
    status: 'Pending',
    paymentMethod: 'PayPal',
  },
  {
    invoiceNumber: 'INV-1009',
    date: '2025-08-11',
    amount: 1500,
    tax: 150,
    total: 1650,
    status: 'Paid',
    paymentMethod: 'UPI',
  },
  {
    invoiceNumber: 'INV-1010',
    date: '2025-08-12',
    amount: 920,
    tax: 92,
    total: 1012,
    status: 'Overdue',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoiceNumber: 'INV-1011',
    date: '2025-08-13',
    amount: 670,
    tax: 67,
    total: 737,
    status: 'Paid',
    paymentMethod: 'Credit Card',
  },
  {
    invoiceNumber: 'INV-1012',
    date: '2025-08-14',
    amount: 810,
    tax: 81,
    total: 891,
    status: 'Pending',
    paymentMethod: 'Cash',
  },
  {
    invoiceNumber: 'INV-1013',
    date: '2025-08-15',
    amount: 1340,
    tax: 134,
    total: 1474,
    status: 'Overdue',
    paymentMethod: 'UPI',
  },
];

const handleRowClick = () => {
    router.push(`/accounts/1`);
  };
  return (
    <div className="rounded-lg py-10 bg-white">
      <h2 className="text-lg font-bold px-6">All Account Details</h2>
      <DynamicTable columns={columns} data={data} onRowClick={handleRowClick}/>
    </div>
  );
}
