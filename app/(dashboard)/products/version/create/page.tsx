"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";

interface VersionFormData {
  versionNumber: string;
  releaseDate: Date|null;
  basePrice: number|null;
  currencyID: string;
}

const CreateVersion: React.FC = () => {
  const [formData, setFormData] = useState<VersionFormData>({
    versionNumber: "",
    releaseDate: null,
    basePrice: null,
    currencyID:"",
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
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
    versionNumber: "",
    releaseDate: null,
    basePrice: null,
    currencyID:"",
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
        !trimmedFormData?.versionNumber ||
        !trimmedFormData?.releaseDate ||
        !trimmedFormData?.basePrice ||
        !trimmedFormData?.currencyID
      ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }

      const res = await api.post(`${formField?.submitUrl}`, {...trimmedFormData, productID: productId});
      if (res?.status == 200) {
        showToast({
          message: `Version created successfully.`,
          type: "success",
        });
        router.push(`/products/${productId}`);
      } else {
        throw new Error("Failed to create version.");
      }
    } catch {
      showToast({
        message: `Failed to create version.`,
        type: "error",
      });
    }
  };

  return (
    <ValidatePermissions permissionType="create">
      <div>
        {formField?.Category && (
          <h2 className="font-semibold text-md mb-2">{formField?.Category}</h2>
        )}
        <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <div
              className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
              onClick={() => router.push("/products")}
            >
              <IoMdArrowBack className="w-6 h-6" />
            </div>
            {/* {formField?.icon && (
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              {formField?.icon}
            </div>
          )} */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Create {formField?.title}
              </h2>
              {formField?.formLabel && (
                <p className="text-gray-500">{formField?.formLabel}</p>
              )}
            </div>
          </div>
          <SbForm
            formField={formField}
            handleSubmit={handleSubmit}
            handleClear={handleClear}
            formData={formData}
            handleFormDataChange={handleFormDataChange}
            submitType="Create"
          />
        </div>
      </div>
    </ValidatePermissions>
  );
};

export default CreateVersion;