"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { ProductTypes, ProductVersion } from "@/types/auth";

interface VersionFormData {
  versionNumber: string;
  releaseDate: Date | null;
  basePrice: number | null;
  currencyID: string;
  productID?: string;
  addonIDs?: string[];
  planIDs?: string[];
}
type GetProductResponse = {
  success: boolean;
  message: string;
  data: ProductTypes;
};
type GetVersionResponse = {
  success: boolean;
  message: string;
  data: ProductVersion;
};

const UpdateVersion: React.FC = () => {
  const [formData, setFormData] = useState<VersionFormData>({
    versionNumber: "",
    releaseDate: null,
    basePrice: null,
    currencyID: ""
  });
  const [productDetails, setProductDetails] = useState<ProductTypes | null>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const trimmedPath = pathname.split("/").slice(0, -2).join("/") || "/";
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
      currencyID: "",
    });
  };
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        if(!formData?.productID) return;
        const res = await api.get<GetProductResponse>(
          `/api/v1/product/${formData?.productID}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setProductDetails(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch product details.`,
          type: "error",
        });
      }
    };
    getProductDetails();
  }, [formData?.productID]);
  useEffect(() => {
    const getVersionDetails = async () => {
      try {
        const res = await api.get<GetVersionResponse>(
          `/api/v1/product-version/${params?.["version-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setFormData({
            versionNumber: response?.versionNumber,
            releaseDate: response?.releaseDate,
            basePrice: response?.basePrice,
            currencyID: response?.currencyID,
            productID: response?.productID,
            addonIDs: response?.addons?.map((addon)=>addon?.addonID),
            planIDs: response?.plans?.map((plan)=>plan?.planID)
          });
        }
      } catch {
        showToast({
          message: `Failed to fetch version details.`,
          type: "error",
        });
      }
    };
    getVersionDetails();
  }, [params]);
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

      const res = await api.put(`${formField?.submitUrl}`, {
        ...trimmedFormData,
        productID: formData?.productID,
        versionID: params?.["version-id"]
      });
      if (res?.status == 200) {
        showToast({
          message: `Version created successfully.`,
          type: "success",
        });
        router.push(`/products/${formData?.productID}`);
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
    <ValidatePermissions permissionType="canUpdate" path="/products/version">
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
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Update {formField?.title} Of {productDetails?.name}
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
            submitType="Update"
            productDetails={productDetails}
          />
        </div>
      </div>
    </ValidatePermissions>
  );
};

export default UpdateVersion;
