"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { FiChevronDown } from "react-icons/fi";
import ProductDragableAdons from "@/components/product/ProductDragableAdons";
import { FaSave, FaTimes } from "react-icons/fa";

interface CurrencyFormData {
  currencyCode: string;
  countryName: string;
  symbol: string;
  decimalPlaces: number | null;
}

const ConvertToDeal: React.FC = () => {
  const [formData, setFormData] = useState<CurrencyFormData>({
    currencyCode: "",
    countryName: "",
    symbol: "",
    decimalPlaces: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  const trimmedPath = pathname.split("/").slice(0, -1).join("/") || "/";
  const formField =
    formFieldconfig[trimmedPath as keyof typeof formFieldconfig];

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      currencyCode: "",
      countryName: "",
      symbol: "",
      decimalPlaces: null,
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const trimmedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );
      if (
        !trimmedFormData?.providerName ||
        !trimmedFormData?.apiKey ||
        !trimmedFormData?.endpointURL ||
        !trimmedFormData?.supportedModes
      ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }

      const res = await api.post(`${formField?.submitUrl}`, trimmedFormData);
      if (res?.status == 200) {
        showToast({
          message: `Payment gateway created successfully.`,
          type: "success",
        });
        router.push("/settings/payment-gateways");
      } else {
        throw new Error("Failed to create payment gateway.");
      }
    } catch {
      showToast({
        message: `Failed to create Payment gateway.`,
        type: "error",
      });
    }
  };

  return (
    <ValidatePermissions permissionType="canCreate" path="/sales/deals">
      <div>
        {formField?.Category && (
          <h2 className="font-semibold text-md mb-2">{formField?.Category}</h2>
        )}
        <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <div
              className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
              onClick={() => router.back()}
            >
              <IoMdArrowBack className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Convert {formField?.title}
              </h2>
              {formField?.formLabel && (
                <p className="text-gray-500">{formField?.formLabel}</p>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product
                  {/* {field?.required && <span className="text-lg text-red-500">*</span>} */}
                </label>
                <div className="relative w-full">
                  <select
                    className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                    //   required={field?.required ?? false}
                  >
                    <option value="">Select</option>
                  </select>

                  {/* Custom Arrow Icon with space after */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <FiChevronDown className="text-gray-600" />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Version
                  {/* {field?.required && <span className="text-lg text-red-500">*</span>} */}
                </label>
                <div className="relative w-full">
                  <select
                    className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                    //   required={field?.required ?? false}
                  >
                    <option value="">Select</option>
                  </select>

                  {/* Custom Arrow Icon with space after */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <FiChevronDown className="text-gray-600" />
                  </div>
                </div>
              </div>
              <ProductDragableAdons handleFormDataChange={() => {}} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Price
                  {/* {field?.label} {field?.required && <span className="text-lg text-red-500">*</span>} */}
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 h-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={"Final Price"}
                  // required={field?.required ?? false}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {formField?.hasClearButton && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 border border-gray-300 rounded-md md:text-sm text-[10px] font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <FaTimes className="inline mr-2" />
                  Clear
                </button>
              )}
              {formField?.hasSubmitButton && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md md:text-sm text-[10px] font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <FaSave className="inline mr-2" />
                  Convert To Deal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ValidatePermissions>
  );
};

export default ConvertToDeal;
