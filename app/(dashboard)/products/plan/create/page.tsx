"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";

interface Feature {
  featureName: string;
  status: boolean;
}
interface PlanFormData {
  // versionID: string;
  // productID: string;
  planName: string;
  planPrice: number | null;
  currencyID: string;
  billingCycle: string;
  isActive: boolean;
  code: string;
  features: Feature[];
}

interface CheckCodeResponse {
  success: boolean;
  message: string;
  data: {
    codeExists: boolean;
  };
}

const CreatePlan: React.FC = () => {
  const [formData, setFormData] = useState<PlanFormData>({
    planName: "",
    planPrice: null,
    currencyID: "",
    billingCycle: "",
    isActive: true,
    code: "",
    features: [],
  });
  const [isCodeExist, setIsCodeExist] = useState(true);
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
      planName: "",
      planPrice: null,
      currencyID: "",
      billingCycle: "",
      isActive: true,
      code: "",
      features: [],
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (isCodeExist) {
        return showToast({
          message: `Plan code exist already, select a different one.`,
          type: "error",
        });
      }
      if (formData?.features?.length <= 0) {
        return showToast({
          message: `Atleast one plan feature required.`,
          type: "error",
        });
      } else if (formData?.features?.some((f) => !f?.featureName?.trim())) {
        return showToast({
          message: `All features must have a feature name.`,
          type: "error",
        });
      }
      const trimmedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );
      if (
        !trimmedFormData?.planName ||
        !trimmedFormData?.planPrice ||
        !trimmedFormData?.currencyID ||
        !trimmedFormData?.billingCycle ||
        !trimmedFormData?.code
      ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }

      const res = await api.post(`${formField?.submitUrl}`, {
        ...trimmedFormData,
      });
      if (res?.status == 200) {
        showToast({
          message: `Plan created successfully.`,
          type: "success",
        });
        router.push(`/products/plans`);
      } else {
        throw new Error("Failed to create Plan.");
      }
    } catch {
      showToast({
        message: `Failed to create plan.`,
        type: "error",
      });
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    const debounceTimer = setTimeout(() => {
      const checkCodeExistOrNot = async () => {
        try {
          const res = await api.get<CheckCodeResponse>(
            `/api/v1/product-plan/check-code/${formData?.code}`,
            { signal: controller.signal }
          );
          if (res?.data?.success && res?.data?.data?.codeExists === false) {
            setIsCodeExist(false);
          } else {
            setIsCodeExist(true);
          }
        } catch (error: any) {
          if (error.name === "CanceledError" || error.name === "AbortError") {
            // Request was canceled
          } else {
            setIsCodeExist(true);
            showToast({
              message: `Failed to check code`,
              type: "error",
            });
          }
        }
      };

      if (formData?.code) {
        checkCodeExistOrNot();
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [formData?.code]);

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
            isCodeExist={isCodeExist}
          />
        </div>
      </div>
    </ValidatePermissions>
  );
};

export default CreatePlan;
