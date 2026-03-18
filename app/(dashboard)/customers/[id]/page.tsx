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
import { useSearchParams } from "next/navigation";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
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
          `/api/v1/common/Clients/${params?.["id"]}`,
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
  const searchParams = useSearchParams();
  const handleBackClick = () => {
    const params = searchParams.toString();
    router.push(`/customers?${params}`);
  };
  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">Customer Details</h2>
      <div className="border-[1px] border-gray-300 rounded-lg min-w-full min-h-[200px] p-4">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="flex items-center mb-6">
              <div
                className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 cursor-pointer transition"
                onClick={handleBackClick}
              >
                <IoMdArrowBack className="w-5 h-5 text-gray-600" />
              </div>

              <div className="flex w-full justify-center">
                <div className="flex items-center gap-4">
                  {/* Avatar / Icon */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                    <HiOutlineHome className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {customer?.organizationName}
                    </h2>
                    <p className="text-sm text-gray-500">Organization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-row items-center justify-between">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <HiOutlineMail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-gray-800 font-medium break-all">
                    {customer?.email}
                  </p>
                </div>
              </div>

              {/* Country */}
              <div className="flex items-start gap-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <HiOutlineLocationMarker className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Country</p>
                  <p className="text-gray-800 font-medium">
                    {customer?.countryName}
                  </p>
                </div>
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
          {activeTab === "products" && (
            <ProductDetails customerId={params?.["id"] as string} />
          )}
          {activeTab === "payments" && (
            <PaymentTable customerId={params?.["id"] as string} />
          )}
          {activeTab === "invoices" && (
            <InvoiceTable customerId={params?.["id"] as string} />
          )}
        </div>
      </div>
    </div>
  );
}
