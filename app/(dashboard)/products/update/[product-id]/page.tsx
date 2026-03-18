"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { ProductTypes } from "@/types/auth";

interface ProductFormData {
  name: string;
  description: string;
  productTypeID: number;
  isActive: boolean;
  pcode: string;
  iscommon: boolean
}
type GetProductResponse = {
  success: boolean;
  message: string;
  data: ProductTypes;
};

const UpdateProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    productTypeID: 1,
    isActive: true,
    pcode: "",
    iscommon: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const trimmedPath = pathname.split("/").slice(0, -2).join("/") || "/";
  const params = useParams();
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
      name: "",
      description: "",
      productTypeID: 1,
      isActive: true,
      pcode: "",
      iscommon: false
    });
  };
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const res = await api.get<GetProductResponse>(
          `/api/v1/product/${params?.["product-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setFormData({
            name: response?.name,
            description: response?.description,
            productTypeID: response?.productTypeID,
            isActive: response?.isActive,
            pcode: response?.pcode,
            iscommon: response?.iscommon
          });
        }
      } catch {
        showToast({
          message: `Failed to fetch product details.`,
          type: "error",
        });
      }
    };
    getProductDetails();
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
        !trimmedFormData?.name ||
        !trimmedFormData?.description ||
        !trimmedFormData?.productTypeID
      ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }

      const res = await api.put(`${formField?.submitUrl}`, {
        ...trimmedFormData,
        productID: params?.["product-id"],
      });
      if (res?.status == 200) {
        showToast({
          message: `Product updated successfully.`,
          type: "success",
        });
        router.push("/products");
      } else {
        throw new Error("Failed to create product.");
      }
    } catch {
      showToast({
        message: `Failed to create product.`,
        type: "error",
      });
    }
  };

  return (
    <ValidatePermissions permissionType="canUpdate">
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
                Update {formField?.title}
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
          />
        </div>
      </div>
    </ValidatePermissions>
  );
};

export default UpdateProduct;
