"use client"
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import DynamicTable from "@/components/table/DynamicTable";
import { useRouter } from "next/navigation";


export default function Invoices() {
  const router = useRouter();
  const columns = [
  { header: 'Invoice Number', accessor: 'invoiceNumber' },
  { header: 'Date', accessor: 'date' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Tax', accessor: 'tax' },
  { header: 'Total', accessor: 'total' },
  { header: 'Payment Id', accessor: 'paymentId' },
  { header: 'Invoiced Date', accessor: 'invoicedDate' },
];

const data = [
  {
    invoiceNumber: 'INV-1001',
    date: '2025-08-01',
    amount: 1200,
    tax: 120,
    total: 1320,
    paymentId: 'PAY-0001',
    invoicedDate: '2025-08-01',
  },
  {
    invoiceNumber: 'INV-1002',
    date: '2025-08-03',
    amount: 850,
    tax: 85,
    total: 935,
    paymentId: 'PAY-0002',
    invoicedDate: '2025-08-03',
  },
  {
    invoiceNumber: 'INV-1003',
    date: '2025-08-05',
    amount: 500,
    tax: 50,
    total: 550,
    paymentId: 'PAY-0003',
    invoicedDate:'2025-08-05',
  },
  {
    invoiceNumber: 'INV-1004',
    date: '2025-08-06',
    amount: 960,
    tax: 96,
    total: 1056,
    paymentId: 'PAY-0004',
    invoicedDate: '2025-08-06',
  },
  {
    invoiceNumber: 'INV-1005',
    date: '2025-08-07',
    amount: 1430,
    tax: 143,
    total: 1573,
    paymentId: 'PAY-0005',
    invoicedDate: '2025-08-07',
  },
  {
    invoiceNumber: 'INV-1006',
    date: '2025-08-08',
    amount: 780,
    tax: 78,
    total: 858,
    paymentId: 'PAY-0006',
    invoicedDate: '2025-08-08',
  },
  {
    invoiceNumber: 'INV-1007',
    date: '2025-08-09',
    amount: 1120,
    tax: 112,
    total: 1232,
    paymentId: 'PAY-0007',
    invoicedDate: '2025-08-09',
  },
  {
    invoiceNumber: 'INV-1008',
    date: '2025-08-10',
    amount: 430,
    tax: 43,
    total: 473,
    paymentId: 'PAY-0008',
    invoicedDate: '2025-08-10',
  },
  {
    invoiceNumber: 'INV-1009',
    date: '2025-08-11',
    amount: 1500,
    tax: 150,
    total: 1650,
    paymentId: 'PAY-0009',
    invoicedDate: '2025-08-11',
  },
  {
    invoiceNumber: 'INV-1010',
    date: '2025-08-12',
    amount: 920,
    tax: 92,
    total: 1012,
    paymentId: 'PAY-0010',
    invoicedDate: '2025-08-12',
  },
  {
    invoiceNumber: 'INV-1011',
    date: '2025-08-13',
    amount: 670,
    tax: 67,
    total: 737,
    paymentId: 'PAY-0011',
    invoicedDate: '2025-08-13',
  },
  {
    invoiceNumber: 'INV-1012',
    date: '2025-08-14',
    amount: 810,
    tax: 81,
    total: 891,
    paymentId: 'PAY-0012',
    invoicedDate:'2025-08-14',
  },
  {
    invoiceNumber: 'INV-1013',
    date: '2025-08-15',
    amount: 1340,
    tax: 134,
    total: 1474,
    paymentId: 'PAY-0013',
    invoicedDate: '2025-08-15',
  },
];


const handleRowClick = () => {
    router.push(`/accounts/invoices/1`);
  };
  return (
    <ValidatePermissions>
    <div className="rounded-lg py-10 bg-white">
      <h2 className="text-lg font-bold px-6">Invoices</h2>
      <DynamicTable columns={columns} data={data} onRowClick={handleRowClick}/>
    </div>
    </ValidatePermissions>
  );
}
