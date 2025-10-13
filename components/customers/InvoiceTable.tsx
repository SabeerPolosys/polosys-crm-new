import { LiaFileInvoiceSolid } from "react-icons/lia";
import DynamicTableType2 from "../table/DynamicTableType2";

export default function InvoiceTable() {
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
  }
];
  return (
    <div className="bg-gray-50 p-4">
      <div className="flex flex-row gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-[1px] border-gray-300">
          <LiaFileInvoiceSolid className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Invoice History</h2>
      </div>
      <DynamicTableType2 columns={columns} data={data} />
    </div>
  );
}
