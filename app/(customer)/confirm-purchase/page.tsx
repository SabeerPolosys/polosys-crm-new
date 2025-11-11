"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmPurchase() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("79.99");
  const [copied, setCopied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handleConfirm = async () => {
   
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
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

  const Sparkles = () => (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
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
            Thanks — your request for a demo has been accepted. You can continue
            using the demo for the next <span className="font-medium">14 days</span>.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-100 p-5">
          <p className="text-xs text-slate-400">Demo ID</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="font-mono font-semibold text-slate-700 break-words">{orderId}</p>
            <button
              onClick={handleCopy}
              className="text-sm px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400">Activated on</p>
          <p className="mt-1 font-medium text-slate-700">{new Date().toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-slate-100 p-5 flex flex-col justify-center text-center">
          <p className="text-xs text-slate-400 mb-1">Expires in</p>
          <p className="text-lg font-semibold text-slate-800">14 days</p>
        </div>
      </div>

      <div className="mt-8 text-sm text-slate-500">
        <p>
          Need help? Reach out at{" "}
          <a href="mailto:support@example.com" className="underline text-indigo-600">
            support@example.com
          </a>
          .
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-t border-slate-100 text-center">
      <p className="text-xs text-slate-500">
        Demo Session ID:{" "}
        <span className="font-mono text-slate-700">{orderId}</span> — Enjoy your demo experience!
      </p>
    </div>
  </div>
</main>

    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
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
              You're about to purchase <span className="font-medium">Pro Plan — Annual</span>.
              Review and confirm to complete the transaction.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400">Plan</p>
                <p className="mt-1 font-medium text-slate-700">Pro — Annual</p>
              </div>
              <div className="rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400">Price</p>
                <p className="mt-1 font-medium text-slate-700">$79.99</p>
              </div>
              <div className="col-span-2 rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-2">Payment Method</p>
                <div className="space-y-3">
                  {[
                    { id: "stripe", name: "Stripe", logo: "💳" },
                    { id: "paypal", name: "PayPal", logo: "🅿️" },
                    { id: "razorpay", name: "Razorpay", logo: "💠" },
                  ].map((method) => (
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
                        <span className="font-medium text-slate-700">{method.name}</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-slate-100 p-4">
                <p className="text-xs text-slate-400">Next billing</p>
                <p className="mt-1 font-medium text-slate-700">Nov 08, 2026</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleConfirm}
                disabled={loading || !selectedPayment}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition ${
                  loading || !selectedPayment
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
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
              <button
                className="px-4 py-3 rounded-lg border border-transparent text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Cancel
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              By confirming you agree to the <span className="underline">Terms</span> and{" "}
              <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
