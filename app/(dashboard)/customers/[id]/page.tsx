"use client";
import { IoPersonOutline } from "react-icons/io5";
import { FiBox } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi2";
import { useEffect, useState } from "react";
import PaymentTable from "@/components/customers/PaymentTable";
import InvoiceTable from "@/components/customers/InvoiceTable";
import ProductDetails from "@/components/customers/ProductDetails";
import { useParams, useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import { showToast } from "@/components/common/ShowToast";
import { CustomerDetails } from "@/types/auth";
import api from "@/lib/axios";
type CustomerResponse = {
  success: boolean;
  message: string;
  data: CustomerDetails;
};

export default function IndividualCustomer() {
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setcustomer] = useState<CustomerDetails | null>(null);
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    const getCustomerDetails = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<CustomerResponse>(
          `/api/v1/common/Clients/${params?.["id"]}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setcustomer(respose || null);
        }
      } catch {
        showToast({
          message: `Failed to fetch customers details.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getCustomerDetails();
  }, []);
  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">Customer Details</h2>
      <div className="border-[1px] border-gray-300 rounded-lg min-w-full min-h-[200px] p-4">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <div className="flex flex-row items-center mb-6">
              <div
                className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
                onClick={() => router.push("/customers")}
              >
                <IoMdArrowBack className="w-6 h-6" />
              </div>
              <div className="flex w-full items-center justify-center">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow-sm">
                    <HiOutlineHome className="w-8 h-8 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {customer?.organizationName}
                    </h2>
                    <p className="text-sm text-gray-500">Retail Store</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div>
                <div>
                  <p className="text-gray-400 font-medium">Email</p>
                  <p>{customer?.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Mobile</p>
                  <p>{customer?.mobile}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Address</p>
                <p className="leading-relaxed">
                  {customer?.countryName}
                  <br />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex gap-4 border-b border-gray-200 mb-4">
            {["products", "payments", "invoices"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 font-medium capitalize border-b-2 transition-all cursor-pointer ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === "products" && <ProductDetails customerId={params?.["id"] as string}/>}
          {activeTab === "payments" && <PaymentTable customerId={params?.["id"] as string}/>}
          {activeTab === "invoices" && <InvoiceTable customerId={params?.["id"] as string}/>}
        </div>
      </div>
    </div>
  );
}
