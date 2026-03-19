"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { showToast } from "../common/ShowToast";
import { formatDateToDDMMYYYY } from "@/helpers/helperFunction";
import { FiBox, FiKey, FiPlusCircle } from "react-icons/fi";
import ActionConfirmationModal from "../common/ActionConfirmationModal";

interface AddonDetail {
  orderDetailsID?: string;
  versionID?: string;
  name?: string;
  currencyCode?: string;
  itemPrice?: number | string;
}

interface ProductDetail {
  orderDetailsID?: string;
  purchaseOrderID: string;
  versionID?: string;
  productName: string;
  versionNumber: string;
  status?: "Active" | "Inactive" | string;
  startDate: Date;
  endDate: Date;
  planName?: string;
  currencyCode: string;
  itemPrice: number | string;
  productType: "Version" | "Addon" | "License" | string;
  planCode?: string;
  addons?: AddonDetail[];
  totaPrice?: number;
  planType?: string;
  billingCycle?: string;
  clientID?: string;
  subscriptionID?: string;
}

type GroupedProducts = Record<string, ProductDetail[]>;

interface ProductDetailsProps {
  customerId: string;
}

function groupByWithAddons<T extends Record<string, any>>(
  array: T[],
  key: keyof T,
): Record<string, T[]> {
  const grouped = array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );

  Object.keys(grouped).forEach((purchaseOrderID) => {
    const items = grouped[purchaseOrderID];
    const versions = items.filter((p) => p.productType !== "Addon");
    const addons = items.filter((p) => p.productType === "Addon");

    versions.forEach((version: any) => {
      const matchedAddons = addons.filter(
        (a: any) => a.versionID === version.versionID,
      );
      if (matchedAddons.length > 0) version.addons = matchedAddons;
    });

    grouped[purchaseOrderID] = versions;
  });

  return grouped;
}

export default function ProductDetails({ customerId }: ProductDetailsProps) {
  const [productDetails, setProductDetails] = useState<GroupedProducts | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await api.get<{ success: boolean; data: ProductDetail[] }>(
          `/api/v1/subscription/${customerId}`,
        );

        if (res?.data?.success && Array.isArray(res.data.data)) {
          const grouped = groupByWithAddons(res.data.data, "purchaseOrderID");
          setProductDetails(grouped);
        }
      } catch (error) {
        showToast({
          message: `Failed to fetch product details.`,
          type: "error",
        });
      }
    };

    getAllProducts();
  }, [customerId]);
  function daysRemaining(expiryDate: string): any {
    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-red-500">Expired</span>;
    }

    if (diffDays === 0) {
      return <span className="text-blue-500">Expires Today</span>;
    }

    return (
      <span className="text-green-500">
        {`${diffDays} Day${diffDays !== 1 ? "s" : ""} Remaining`}
      </span>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Products Details
      </h2>

      <div className="grid grid-cols-1 gap-8">
        {productDetails && Object.keys(productDetails).length > 0 ? (
          Object.entries(productDetails).map(
            ([purchaseOrderID, items], index) => (
              <div key={index} className="mb-10">
                <div className="grid grid-cols-1 gap-6">
                  {items.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col justify-between h-full min-h-[320px]">
                        {/* Top Section */}
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-sm">
                                {product.productType === "License" ? (
                                  <FiKey className="text-xl text-white" />
                                ) : (
                                  <FiBox className="text-xl text-white" />
                                )}
                              </div>

                              <div>
                                <p className="text-lg font-semibold text-gray-900">
                                  {product.productName}
                                </p>

                                <p className="text-sm text-gray-400">Product</p>

                                <p className="text-xs text-gray-500 mt-1">
                                  From:{" "}
                                  {formatDateToDDMMYYYY(product?.startDate)}
                                </p>
                              </div>
                            </div>

                            {/* Demo / Registered Badge */}
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                product.planType === "Demo"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {product.planType === "Demo"
                                ? "Demo"
                                : "Registered"}
                            </span>
                          </div>

                          {/* Plan Info */}
                          <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-500 text-xs">Plan</p>
                              <p className="font-medium text-gray-800">
                                {product.planName || "-"}
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-500 text-xs">Plan Code</p>
                              <p className="font-medium text-gray-800">
                                {product.planCode || "-"}
                              </p>
                            </div>

                            <div className="bg-indigo-50 rounded-lg p-3">
                              <p className="text-indigo-500 text-xs">
                                Billing Cycle
                              </p>
                              <p className="font-medium text-indigo-700">
                                {product.billingCycle || "-"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">
                                Expiry Date
                              </p>

                              <p className="font-medium text-gray-800">
                                {formatDateToDDMMYYYY(product.endDate)}
                              </p>

                              {/* Active / Expired / Remaining */}
                              <div className="mt-1 text-xs font-medium">
                                {daysRemaining(product.endDate?.toString())}
                              </div>
                            </div>

                            <div>
                              <p className="text-gray-500 text-xs">Price</p>
                              <p className="font-semibold text-gray-900">
                                {product.currencyCode} {product.totaPrice}
                              </p>
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                              >
                                Renew Plan
                              </button>
                              <ActionConfirmationModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                title="Renew plan manually"
                                message="Are you sure you want to renew plan manually?"
                                confirmLabel="Yes, Renew"
                                cancelLabel="Cancel"
                                onConfirm={async () => {
                                  if (
                                    product?.clientID &&
                                    product?.subscriptionID
                                  ) {
                                    await api.put(
                                      "/api/v1/subscription/renew",
                                      {
                                        clientid: product?.clientID,
                                        subscriptionid: product?.subscriptionID,
                                      },
                                    );
                                    showToast({
                                      message: "Status changed",
                                      type: "success",
                                    });
                                    // setUpdateFlag((prev) => prev + 1);
                                  } else {
                                    showToast({
                                      message: "Failed to renew plan.",
                                      type: "error",
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Add-ons */}
                      {product.addons && product.addons.length > 0 && (
                        <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FiPlusCircle className="text-indigo-500" />
                            <p className="text-sm font-semibold text-gray-800">
                              Add-ons Available
                            </p>
                          </div>

                          <ul className="text-sm text-gray-700 space-y-1">
                            {product.addons.map((addon) => (
                              <li
                                key={addon.orderDetailsID}
                                className="flex justify-between"
                              >
                                <span>{addon.name || "Addon"}</span>
                                <span className="font-medium">
                                  {addon.currencyCode} {addon.itemPrice}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )
        ) : (
          <p className="text-gray-500">No product details found.</p>
        )}
      </div>
    </div>
  );
}
