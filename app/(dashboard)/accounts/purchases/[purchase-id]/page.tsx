"use client";

import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiBox, FiKey, FiPlusCircle } from "react-icons/fi";
import { FiShoppingCart, FiEyeOff } from "react-icons/fi";

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
    // <div>
    //   <div className="flex flex-row justify-center bg-gray-700 h-32 text-white rounded-t-lg">
    //     <h2 className="text-2xl font-semibold mt-4">Books</h2>
    //   </div>
    //   <div className="mt-[-40px] bg-gray-100 mx-32 rounded-lg">
    //     {/* Body */}
    //     <div className="p-8 grid grid-cols-2 gap-x-8 gap-y-6 text-gray-700">
    //       <div>
    //         <p className="text-sm text-gray-500">Customer</p>
    //         <p className="text-lg font-semibold">{product.customer}</p>
    //       </div>
    //       <div>
    //         <p className="text-sm text-gray-500">Plan</p>
    //         <p className="text-lg font-semibold">{product.plan}</p>
    //       </div>
    //       <div>
    //         <p className="text-sm text-gray-500">Purchase Date</p>
    //         <p className="text-lg font-medium">{product.purchaseDate}</p>
    //       </div>
    //       <div>
    //         <p className="text-sm text-gray-500">Last Renewed</p>
    //         <p className="text-lg font-medium">{product.lastRenewed}</p>
    //       </div>
    //       <div>
    //         <p className="text-sm text-gray-500">Expiry Date</p>
    //         <p className="text-lg font-medium">{product.expiryDate}</p>
    //       </div>
    //       <div className="flex items-center space-x-2">
    //         {product.autoRenew ? (
    //           <FaCheckCircle className="text-green-500 text-lg" />
    //         ) : (
    //           <FaTimesCircle className="text-red-500 text-lg" />
    //         )}
    //         <div>
    //           <p className="text-sm text-gray-500">Auto Renew</p>
    //           <p className="text-lg font-medium">
    //             {product.autoRenew ? "Enabled" : "Disabled"}
    //           </p>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Footer */}
    //     <div className="px-8 py-6 border-t border-gray-200">
    //       <div>
    //         <p className="text-sm text-gray-500">Price</p>
    //         <p className="text-2xl font-bold text-gray-800">
    //           {product.currency}
    //           {product.price.toLocaleString()}
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      <div className="flex flex-row items-center justify-between my-4">
        <h2 className="font-semibold">Purchase Details</h2>
      </div>
      <div className="p-4 rounded-lg border-[1px] border-gray-300 bg-gray-50">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - EasyBiz Neo */}
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between">
              {/* Header */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-white rounded-full border border-gray-300">
                    <FiBox className="text-xl text-gray-700" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      EasyBiz Neo{" "}
                      <span className="text-gray-500 font-normal">Silver</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      From: Feb 22, 2024
                    </p>
                  </div>
                </div>

                {/* Top Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                  <div>
                    <p className="text-gray-500">Plan</p>
                    <p className="font-medium">Basic</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Billing Cycle</p>
                    <p className="font-medium">Monthly</p>
                  </div>
                </div>
              </div>

              {/* Bottom Detail */}
              <div className="pt-4 border-t border-gray-300 text-sm text-gray-700">
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium">Feb 22, 2027</p>
              </div>
            </div>

            {/* Card 2 - License */}
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between">
              {/* Header */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-white rounded-full border border-gray-300">
                    <FiKey className="text-xl text-gray-700" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      License{" "}
                      <span className="text-gray-500 font-normal">
                        Information
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Start Date: Feb 22, 2024
                    </p>
                  </div>
                </div>

                {/* Top Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                  <div>
                    <p className="text-gray-500">ID</p>
                    <p className="font-medium">672542</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium">Feb 22, 2024</p>
                  </div>
                </div>
              </div>

              {/* Bottom Detail */}
              <div className="pt-4 border-t border-gray-300 text-sm text-gray-700">
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium">Feb 22, 2027</p>
              </div>
            </div>

            {/* Card 3 - Add-ons (unchanged) */}
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-white rounded-full border border-gray-300">
                  <FiPlusCircle className="text-xl text-gray-700" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Add-ons{" "}
                    <span className="text-gray-500 font-normal">Avaialble</span>
                  </p>
                </div>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>RPOS Sync service</li>
                <li>Van Sale</li>
                <li>Additional database</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl m-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full border border-gray-300">
                <FiShoppingCart className="text-xl text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Purchase details
              </h2>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition">
              Convert to Invoice
            </button>
          </div>

          {/* Main Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Product */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Product</p>
              <p className="text-base font-semibold text-gray-800">
                EasyBiz Neo{" "}
                <span className="text-gray-500 font-normal">Silver</span>
              </p>
            </div>

            {/* Purchase & Expiry */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Purchase Date</p>
              <p className="text-base font-medium text-gray-800">03-08-2025</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
              <p className="text-base font-medium text-gray-800">03-08-2026</p>
            </div>

            {/* Auto Renew */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Auto Renew</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="font-medium">Disabled</span>
                <FiEyeOff />
              </div>
            </div>
          </div>

          {/* Secondary Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Customer</p>
              <p className="text-base font-medium text-gray-800">Rahul</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Plan</p>
              <p className="text-base font-medium text-gray-800">Basic</p>
            </div>
          </div>

          {/* Footer: Price */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-xl font-semibold text-gray-800">₹1,500</p>
          </div>
        </div>
      </div>
    </div>
  );
}
