"use client"
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PhonepeResponse() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    return;

    const { transactionId, merchantTransactionId, code } = router.query;
    

    const verifyPayment = async () => {
      try {
        const res = await api.get("/api/v1/pay/verify", {
          params: { orderId: merchantTransactionId,
                paymentId: transactionId,
                // signature: response?.razorpay_signature,
                gatewayType: "PhonePe"},
        });

        if (res.data?.status === "SUCCESS") {
          setStatus("success");
          setMessage("Payment successful 🎉");
        } else if (res.data?.status === "PENDING") {
          setStatus("pending");
          setMessage("Payment pending ⏳");
        } else {
          setStatus("failed");
          setMessage("Payment failed ❌");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
        setMessage("Unable to verify payment");
      }
    };

    verifyPayment();
  }, [router]);

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-600";
    }
  };

  const getButton = () => {
    if (status === "success") {
      return (
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Go to Dashboard
        </button>
      );
    } else if (status === "failed") {
      return (
        <button
          onClick={() => router.push("/checkout")}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      );
    } else if (status === "pending") {
      return (
        <button
          onClick={() => router.reload()}
          className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Refresh Status
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h2 className={`text-2xl font-semibold ${getStatusColor()}`}>{message}</h2>

        {status === "loading" && (
          <div className="mt-4">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Please wait...</p>
          </div>
        )}

        {getButton()}
      </div>

      {/* Tailwind Loader */}
      <style jsx>{`
        .loader {
          border-width: 4px;
          border-top-color: transparent;
        }
      `}</style>
    </div>
  );
}
