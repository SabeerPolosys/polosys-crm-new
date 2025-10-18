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
import { PaymentGateway } from "@/types/auth";

interface PaymentGatewayFormData {
  providerName: string;
  apiKey: string;
  endpointURL: string;
  supportedModes: string;
  isActive: boolean;
  secretKey: string;
}
type PaymentGatewayResponse = {
  success: boolean;
  message: string;
  data: PaymentGateway;
};

const UpdatePaymentGateway: React.FC = () => {
  const [formData, setFormData] = useState<PaymentGatewayFormData>({
    providerName: "",
    apiKey: "",
    endpointURL: "",
    supportedModes: "",
    isActive: true,
    secretKey: ""
  });
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
      providerName: "",
      apiKey: "",
      endpointURL: "",
      supportedModes: "",
      isActive: true,
      secretKey: ""
    });
  };
  useEffect(() => {
    const getGatewayDetails = async () => {
      try {
        const res = await api.get<PaymentGatewayResponse>(
          `/api/v1/payment-gateway/${params?.["gateway-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setFormData({
            providerName: response?.providerName,
            apiKey: response?.apiKey,
            endpointURL: response?.endpointURL,
            supportedModes: response?.supportedModes,
            isActive: response?.isActive,
            secretKey: response?.secretKey
          });
        }
      } catch {
        showToast({
          message: `Failed to fetch gateway details.`,
          type: "error",
        });
      }
    };
    getGatewayDetails();
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
    <ValidatePermissions permissionType="canCreate">
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

export default UpdatePaymentGateway;
