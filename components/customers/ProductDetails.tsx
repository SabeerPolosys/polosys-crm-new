"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { showToast } from "../common/ShowToast";
import { formatDateToDDMMYYYY } from "@/helpers/helperFunction";
import { FiBox, FiKey, FiPlusCircle } from "react-icons/fi";

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
}

type GroupedProducts = Record<string, ProductDetail[]>;

interface ProductDetailsProps {
  customerId: string;
}

function groupByWithAddons<T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  const grouped = array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);

  Object.keys(grouped).forEach((purchaseOrderID) => {
    const items = grouped[purchaseOrderID];
    const versions = items.filter((p) => p.productType !== "Addon");
    const addons = items.filter((p) => p.productType === "Addon");

    versions.forEach((version: any) => {
      const matchedAddons = addons.filter(
        (a: any) => a.versionID === version.versionID
      );
      if (matchedAddons.length > 0) version.addons = matchedAddons;
    });

    grouped[purchaseOrderID] = versions;
  });

  return grouped;
}

export default function ProductDetails({ customerId }: ProductDetailsProps) {
  const [productDetails, setProductDetails] = useState<GroupedProducts | null>(
    null
  );

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await api.get<{ success: boolean; data: ProductDetail[] }>(
          `/api/v1/subscription/${customerId}`
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Products Details
      </h2>

      <div className="grid grid-cols-2 gap-8">
        {productDetails && Object.keys(productDetails).length > 0 ? (
          Object.entries(productDetails).map(
            ([purchaseOrderID, items], index) => (
              <div key={purchaseOrderID} className="mb-10">
                <h3 className="text-lg font-semibold text-gray-500 mb-4">
                  {/* Purchase Order {index + 1}:{" "} */}
                  {items?.[0]?.startDate
                    ? formatDateToDDMMYYYY(items?.[0]?.startDate)
                    : ""}
                </h3>

                <div className="grid grid-cols-1 gap-6 items-stretch">
                  {items.map((product) => (
                    <div
                      key={product.orderDetailsID}
                      className="bg-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between h-full min-h-[320px]"
                    >
                      <div className="flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-white rounded-full border border-gray-300">
                              {product.productType === "License" ? (
                                <FiKey className="text-xl text-gray-700" />
                              ) : (
                                <FiBox className="text-xl text-gray-700" />
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-800">
                                {product.productName}{" "}
                                <span className="text-gray-500 font-normal">
                                  {product.versionNumber}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                From:{" "}
                                {formatDateToDDMMYYYY(product?.startDate)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                            <div>
                              <p className="text-gray-500">Plan</p>
                              <p className="font-medium">
                                {product.planName || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Plan Code</p>
                              <p className="font-medium">
                                {product.planCode || "-"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-300 text-sm text-gray-700">
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                              <p className="text-gray-500">Expiry Date</p>
                              <p className="font-medium">
                                {formatDateToDDMMYYYY(product.endDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Price</p>
                              <p className="font-medium">
                                {product.currencyCode} {product.totaPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {product.addons && product.addons.length > 0 && (
                        <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FiPlusCircle className="text-gray-600" />
                            <p className="text-sm font-semibold text-gray-800">
                              Add-ons Available
                            </p>
                          </div>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {product.addons.map((addon) => (
                              <li key={addon.orderDetailsID}>
                                {addon.name || "Addon"} — ({addon.currencyCode}{" "}
                                {addon.itemPrice})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-gray-500">No product details found.</p>
        )}
      </div>
    </div>
  );
}
