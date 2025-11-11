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
import { ProductEdition, ProductTypes } from "@/types/auth";

interface EditionFormData {
  eCode: string;
  eName: string;
  noOfUsers: number | null;
  description: string;
  isActive: boolean;
  productID?: string;
}
type GetProductResponse = {
  success: boolean;
  message: string;
  data: ProductTypes;
};
type GetEditionResponse = {
  success: boolean;
  message: string;
  data: ProductEdition;
};

const UpdateEdition: React.FC = () => {
  const [formData, setFormData] = useState<EditionFormData>({
    eCode: "",
    eName: "",
    noOfUsers: null,
    description: "",
    isActive: true,
  });
  const [productDetails, setProductDetails] = useState<ProductTypes | null>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
      eCode: "",
      eName: "",
      noOfUsers: null,
      description: "",
      isActive: true,
    });
  };
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        if (!formData?.productID) return;
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
    const getEditionDetails = async () => {
      try {
        const res = await api.get<GetEditionResponse>(
          `/api/v1/edition/${params?.["edition-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setFormData({
            eCode: response?.eCode,
            eName: response?.eName,
            noOfUsers: response?.noOfUsers,
            description: response?.description,
            isActive: response?.isActive,
            productID: response?.productId,
          });
        }
      } catch {
        showToast({
          message: `Failed to fetch edition details.`,
          type: "error",
        });
      }
    };
    getEditionDetails();
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
        !trimmedFormData?.eCode ||
        !trimmedFormData?.eName ||
        !trimmedFormData?.noOfUsers ||
        !trimmedFormData?.description
      ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }

      const res = await api.put(`${formField?.submitUrl}`, {
        ...trimmedFormData,
        editionId: params?.["edition-id"]
      });
      if (res?.status == 200) {
        showToast({
          message: `Edition created successfully.`,
          type: "success",
        });
        router.push(`/products/${formData?.productID}`);
      } else {
        throw new Error("Failed to update edition.");
      }
    } catch {
      showToast({
        message: `Failed to update edition.`,
        type: "error",
      });
    }
  };

  return (
    <ValidatePermissions permissionType="canCreate">
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
                Update {formField?.title} For {productDetails?.name}
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

export default UpdateEdition;
