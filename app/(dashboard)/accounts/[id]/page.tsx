import AccountMenuList from "@/components/accounts/AccountMenuList";
import LineChart from "@/components/accounts/LineChart";
import { LiaFileInvoiceSolid } from "react-icons/lia";

export default function IndividualAccount() {
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-semibold">Account Details</h2>
        <button className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs">
          {" "}
          Upload Invoice
        </button>
      </div>
      <div className="min-w-full min-h-96 rounded-lg my-4 border-[1px] grid grid-cols-6 gap-4 p-2">
        <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold">Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded flex flex-col gap-4">
              <p className="text-sm">Total Purchase</p>
              <p className="text-2xl font-bold">₹ 12,784</p>
            </div>
            <div className="p-4 bg-white rounded flex flex-col gap-4">
              <p className="text-sm">Active Product</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="p-4 bg-white rounded flex flex-col gap-4">
              <p className="text-sm">Purchase Invoice</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="p-4 bg-white rounded flex flex-col gap-4">
              <p className="text-sm">Support Tickets</p>
              <p className="text-2xl font-bold">6</p>
            </div>
          </div>
          <div className="mt-4 p-4 ">
            <h2 className="font-semibold text-xl mb-2">Purchase History</h2>
            <div className="min-w-fit">
              <LineChart />
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-4">
                <div className="border-[1px] w-12 h-12 rounded-full flex items-center justify-center">
                <LiaFileInvoiceSolid  className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-bold">Invoice - 654</h3>
                <p className="text-gray-500">18/09/2025</p>
              </div>
              </div>
              <div className="text-xs text-gray-600">
                <p>Ashok</p>
                <p>+91 7885423625</p>
              </div>
            </div>
            <AccountMenuList />
        </div>
      </div>
    </div>
  );
}
