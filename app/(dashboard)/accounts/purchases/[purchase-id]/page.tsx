"use client";

import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ProductDetailsPage() {
  const [product] = useState({
    product: "Books",
    version: "Books Gcc",
    purchaseDate: "2025-08-03",
    lastRenewed: "2025-08-03",
    expiryDate: "2025-09-02",
    plan: "Ultimate",
    status: "Active",
    price: 1500,
    currency: "₹",
    customer: "Rahul",
    autoRenew: false,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6">
            <h1 className="text-3xl font-semibold text-white">
              {product.product}
            </h1>
            <p className="text-white/80">{product.version}</p>

            <span
              className={`absolute top-6 right-6 px-4 py-1 text-sm font-semibold rounded-full ${
                product.status === "Active"
                  ? "bg-white text-green-600"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.status}
            </span>
          </div>

          {/* Body */}
          <div className="p-8 grid grid-cols-2 gap-x-8 gap-y-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-lg font-semibold">{product.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-lg font-semibold">{product.plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purchase Date</p>
              <p className="text-lg font-medium">{product.purchaseDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Renewed</p>
              <p className="text-lg font-medium">{product.lastRenewed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="text-lg font-medium">{product.expiryDate}</p>
            </div>
            <div className="flex items-center space-x-2">
              {product.autoRenew ? (
                <FaCheckCircle className="text-green-500 text-lg" />
              ) : (
                <FaTimesCircle className="text-red-500 text-lg" />
              )}
              <div>
                <p className="text-sm text-gray-500">Auto Renew</p>
                <p className="text-lg font-medium">
                  {product.autoRenew ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-bold text-gray-800">
                {product.currency}
                {product.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
