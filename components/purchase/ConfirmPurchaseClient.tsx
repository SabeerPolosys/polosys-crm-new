"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Script from "next/script";
import { showToast } from "@/components/common/ShowToast";
import { v4 as uuidv4 } from 'uuid';

export default function ConfirmPurchaseClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const clientId = searchParams.get("clientID");

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("79.99");
  const [copied, setCopied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [availableGateways, setAvailableGateways] = useState<any>([]);
  const [clientDetails, setClientDetails] = useState<any>(null);

  useEffect(() => {
    setDate(new Date(planDetails?.startDate).toLocaleString())
  }, [planDetails?.startDate])

  useEffect(() => {
  let redirectTimer;

  const getPlanDetails = async () => {
    const result = await api.get(`/api/v1/subscription/${clientId}`);

    if (result?.data?.success && result?.data?.data?.length > 0) {
      setPlanDetails(result?.data?.data[0]);

      if (status === "demo") {
        redirectTimer = setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_BOOK_CRM_URL}/login/`;
        }, 2000); // 2 seconds
      }
    }
  };

  getPlanDetails();

  return () => {
    if (redirectTimer) clearTimeout(redirectTimer);
  };
}, [searchParams]);

  const handleConfirm = async () => {
    try {
      const { data } = await api.post("/api/v1/pay/create-order", {
        amount: planDetails?.totaPrice,
        taxAmount:0,
        currency: "INR",
        receiptId: uuidv4(),
        gatewayType: selectedPayment,
        currencyID: "8D5C3D62-DCED-4756-8367-04927829E39B",
        editionID: planDetails?.editionID
      });
      switch (selectedPayment) {
        case "Razorpay":
          if (!window || !(window as any).Razorpay) {
            showToast({
              message: `Unable to load payment gateway. Try again.`,
              type: "error",
            });
            return;
          }

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: data.amount,
            currency: data.currency || "INR",
            name: clientDetails?.organizationName,
            description: planDetails?.planName,
            order_id: data.orderId,

            handler: async function (response: any) {
              console.log("Payment success response:", response);
              const result = await api.post("/api/v1/pay/verify", {
                orderId: response?.razorpay_order_id,
                paymentId: response?.razorpay_payment_id,
                signature: response?.razorpay_signature,
                gatewayType: "Razorpay",
                clientID: clientId
              });
              if (result?.data?.success) {
                showToast({
                  message: `Payment successfull.`,
                  type: "success",
                });
                window.location.href = `${process.env.NEXT_PUBLIC_BOOK_CRM_URL}/login/`;
              }
            },

            prefill: {
              name: clientDetails?.organizationName,
              email: clientDetails?.email,
              contact: "",
            },

            // theme: {
            //   color: "#3399cc",
            // },
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
          break;
        case "PhonePe":
          if (data?.redirectUrl) {
            window.location.href = data.redirectUrl;
          }
          break;
        default:
          showToast({
            message: `Unable to load selected gateway. Try again.`,
            type: "error",
          });
          return;
      }
    } catch (err) {
      console.error(err);
      showToast({
        message: `Something went wrong, try again.`,
        type: "error",
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(planDetails?.subscriptionID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Could not copy ID");
    }
  };

  const handlePrint = () => window.print();

  useEffect(() => {
    const id = searchParams.get("orderId");
    const amt = searchParams.get("amount");
    if (id) setOrderId(id);
    if (amt) setAmount(amt);
  }, [searchParams]);

  useEffect(()=>{
      if(!planDetails?.countryID || status === "demo") return;
      const getAvailableGateways = async () => {
        try{
          const result = await api.get(`/api/v1/payment-gateway/country-mappingfilter/?countryId=${planDetails?.countryID}`);
          setSelectedPayment((result?.data?.data?.find((method)=>method?.isDefault)?.gatewayName) ?? null)
          setAvailableGateways(result?.data?.data ?? []);
        }catch{

        }
      }
      getAvailableGateways();
  },[planDetails])
  useEffect(()=>{
      if(!planDetails?.clientID || status === "demo") return;
      const getClientDetails = async () => {
        try{
          const result = await api.get(`/api/v1/common/Clients/${planDetails?.clientID}`);
          setClientDetails(result?.data?.data);
        }catch{

        }
      }
      getClientDetails();
  },[planDetails])

  const Sparkles = () => (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 600 300"
        preserveAspectRatio="none"
      >
        <g opacity="0.18" fill="none" stroke="#C4B5FD" strokeWidth="2">
          <circle cx="70" cy="50" r="2" />
          <circle cx="520" cy="40" r="2" />
          <circle cx="480" cy="220" r="2" />
          <circle cx="120" cy="200" r="2" />
        </g>
      </svg>
    </div>
  );

  if (status === "demo") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-6 relative">
        <Sparkles />
        <div className="relative w-full max-w-3xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-5">
              <div className="rounded-full bg-green-50 p-3">
                <svg
                  className="w-10 h-10 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Demo access granted
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Thanks — your request for a demo has been accepted. You can
                  continue using the demo for the next{" "}
                  <span className="font-medium">14 days</span>.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-100 p-5">
                <p className="text-xs text-slate-400">Plan Name</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-mono font-semibold text-slate-700 break-words">
                    {planDetails?.planName } ({planDetails?.productName})
                  </p>
                  {/* <button
                    onClick={handleCopy}
                    className="text-sm px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button> */}
                </div>

                <p className="mt-4 text-xs text-slate-400">Activated on</p>
                <p className="mt-1 font-medium text-slate-700">
                  {date} 
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-5 flex flex-col justify-center text-center">
                <p className="text-xs text-slate-400 mb-1">Expires in</p>
                <p className="text-lg font-semibold text-slate-800">14 days</p>
              </div>
            </div>

            <div className="mt-8 text-sm text-slate-500">
              <p>
                Need help? Reach out at{" "}
                <a
                  href="mailto:support@example.com"
                  className="underline text-indigo-600"
                >
                  support@example.com
                </a>
                .
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Demo Session ID:{" "}
              <span className="font-mono text-slate-700">{planDetails?.subscriptionID}</span> —
              Enjoy your demo experience!
            </p>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
      <Script
        id="razorpay-checkout-js"
        src={process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_URL}
      />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 sm:p-10">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-inner">
              🛒
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Confirm your purchase
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;re about to purchase{" "}
              <span className="font-medium">{planDetails?.planName} plan</span>. Review and
              confirm to complete the transaction.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400">Plan</p>
                <p className="mt-1 font-medium text-slate-700">{planDetails?.eName} — {planDetails?.billingCycle}</p>
              </div>
              <div className="rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400">Price</p>
                <p className="mt-1 font-medium text-slate-700">{planDetails?.totaPrice}</p>
              </div>
              <div className="col-span-2 rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-2">Payment Method</p>
                <div className="space-y-3">
                  {/* {[
                    // { id: "stripe", name: "Stripe", logo: "💳" },
                    // { id: "paypal", name: "PayPal", logo: "🅿️" },
                    { id: "Razorpay", name: "Razorpay", logo: "💠" },
                    { id: "PhonePe", name: "PhonePe", logo: "🅿️" },
                  ] */}
                  {availableGateways?.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition ${
                        selectedPayment === method.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.logo}</span>
                        <span className="font-medium text-slate-700">
                          {method.gatewayName}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method.gatewayName}
                        checked={selectedPayment === method.gatewayName}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400">Next billing</p>
                <p className="mt-1 font-medium text-slate-700">{new Date(planDetails?.endDate)?.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleConfirm}
                disabled={loading || !selectedPayment}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition ${
                  loading || !selectedPayment
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeOpacity="0.2"
                        strokeWidth="4"
                      />
                      <path
                        d="M22 12a10 10 0 00-10-10"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm & Pay"
                )}
              </button>
              <button className="px-4 py-3 rounded-lg border border-transparent text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                Cancel
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              By confirming you agree to the{" "}
              <span className="underline">Terms</span> and{" "}
              <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
