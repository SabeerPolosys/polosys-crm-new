import { IoPersonOutline } from "react-icons/io5";
import { FiBox } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi2";
import { BsCart3 } from "react-icons/bs";
import DynamicTableType2 from "@/components/table/DynamicTableType2";

export default function page() {
  const columns = [
    { header: "Invoice Number", accessor: "invoiceNumber" },
    { header: "Date", accessor: "date" },
    { header: "Amount", accessor: "amount" },
    { header: "Tax", accessor: "tax" },
    { header: "Total", accessor: "total" },
    { header: "Status", accessor: "status" },
    { header: "Payment Method", accessor: "paymentMethod" },
  ];

  const data = [
    {
      invoiceNumber: "INV-1001",
      date: "2025-08-01",
      amount: 1200,
      tax: 120,
      total: 1320,
      status: "Pending",
      paymentMethod: "Credit Card",
    },
    {
      invoiceNumber: "INV-1002",
      date: "2025-08-03",
      amount: 850,
      tax: 85,
      total: 935,
      status: "Paid",
      paymentMethod: "Bank Transfer",
    },
    {
      invoiceNumber: "INV-1003",
      date: "2025-08-05",
      amount: 500,
      tax: 50,
      total: 550,
      status: "Overdue",
      paymentMethod: "PayPal",
    },
    {
      invoiceNumber: "INV-1004",
      date: "2025-08-06",
      amount: 960,
      tax: 96,
      total: 1056,
      status: "Pending",
      paymentMethod: "Cash",
    },
    {
      invoiceNumber: "INV-1005",
      date: "2025-08-07",
      amount: 1430,
      tax: 143,
      total: 1573,
      status: "Paid",
      paymentMethod: "Credit Card",
    },
    {
      invoiceNumber: "INV-1006",
      date: "2025-08-08",
      amount: 780,
      tax: 78,
      total: 858,
      status: "Overdue",
      paymentMethod: "Bank Transfer",
    },
    {
      invoiceNumber: "INV-1007",
      date: "2025-08-09",
      amount: 1120,
      tax: 112,
      total: 1232,
      status: "Paid",
      paymentMethod: "Credit Card",
    },
    {
      invoiceNumber: "INV-1008",
      date: "2025-08-10",
      amount: 430,
      tax: 43,
      total: 473,
      status: "Pending",
      paymentMethod: "PayPal",
    },
    {
      invoiceNumber: "INV-1009",
      date: "2025-08-11",
      amount: 1500,
      tax: 150,
      total: 1650,
      status: "Paid",
      paymentMethod: "UPI",
    },
    {
      invoiceNumber: "INV-1010",
      date: "2025-08-12",
      amount: 920,
      tax: 92,
      total: 1012,
      status: "Overdue",
      paymentMethod: "Bank Transfer",
    },
    {
      invoiceNumber: "INV-1011",
      date: "2025-08-13",
      amount: 670,
      tax: 67,
      total: 737,
      status: "Paid",
      paymentMethod: "Credit Card",
    },
    {
      invoiceNumber: "INV-1012",
      date: "2025-08-14",
      amount: 810,
      tax: 81,
      total: 891,
      status: "Pending",
      paymentMethod: "Cash",
    },
    {
      invoiceNumber: "INV-1013",
      date: "2025-08-15",
      amount: 1340,
      tax: 134,
      total: 1474,
      status: "Overdue",
      paymentMethod: "UPI",
    },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">Customer Details</h2>
      <div className="border-[1px] border-gray-300 rounded-lg min-w-full min-h-[200px] p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 bg-gray-50 rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-15 h-15 rounded-full bg-white flex items-center justify-center border-[1px] border-gray-300">
                <span className="text-xl">
                  {" "}
                  <IoPersonOutline className="w-8 h-8" />
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Ashok</h2>
                <p className="text-sm text-gray-500">
                  Join since : Aug 14, 2024
                </p>
              </div>
            </div>
            <div className="text-sm space-y-2 flex flex-row justify-between">
              <p>
                <span className="text-gray-400">Phone</span>
                <br />
                <span className="text-gray-600">+91 787374532</span>
              </p>
              <p>
                <span className="text-gray-400">Email</span>
                <br />
                <span className="text-gray-600">ashok1342@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="col-span-1 bg-gray-50 rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-15 h-15 rounded-full bg-white flex items-center justify-center border-[1px] border-gray-300">
                <span className="text-xl">
                  {" "}
                  <FiBox className="w-8 h-8" />{" "}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">
                  EasyBiz Neo <span className="text-gray-400">Basic</span>
                </h2>
                <p className="text-sm text-gray-500">From : Aug 14, 2024</p>
              </div>
            </div>
            <div className="text-sm space-y-2 flex flex-row gap-4 justify-between flex-wrap">
              <p>
                <span className="text-gray-400">Plan</span>
                <br />
                <span className="text-gray-600">Premium</span>
              </p>
              <p>
                <span className="text-gray-400">Billing Cycle</span>
                <br />
                <span className="text-gray-600">Yearly</span>
              </p>
              <p>
                <span className="text-gray-400">Expiry Date</span>
                <br />
                <span className="text-gray-600">Aug 14, 2026</span>
              </p>
            </div>
          </div>

          <div className="col-span-1 bg-gray-50 rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-15 h-15 rounded-full bg-white flex items-center justify-center border-[1px] border-gray-300">
                <span className="text-xl">
                  {" "}
                  <HiOutlineHome className="w-8 h-8" />{" "}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black">
                  KPM Hypermarket
                </h2>
                <p className="text-sm text-gray-500">Store</p>
              </div>
            </div>
            <div className="text-sm space-y-2 flex flex-row justify-between">
              <p>
                <span className="text-gray-400">Delivery Address</span>
                <span className="text-gray-600">
                  <br />
                  Pk Street, thondayan junction,
                  <br />
                  Kozhikode, 673002
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4">
          <div className="flex flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-[1px] border-gray-300">
              <BsCart3 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Payment History</h2>
          </div>
          <DynamicTableType2 columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
