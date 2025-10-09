"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import { rightsFormConfig } from "@/config/permissionsFormConfig";
import { PermissionModuleType } from "@/types/auth";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";

interface PermissionModuleFormData {
  moduleName: string;
  description: string;
}
type GetPermissionModuleResponse = {
  success: boolean;
  message: string;
  data: PermissionModuleType;
};

const UpdatePermissionModule: React.FC = () => {
  const [formData, setFormData] = useState<PermissionModuleFormData>({
    moduleName: "",
    description: "",
  });
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const trimmedPath = pathname.split("/").slice(0, -2).join("/") || "/";
  const formField =
    rightsFormConfig[trimmedPath as keyof typeof rightsFormConfig];

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClear = () => {
    setFormData({ moduleName: "", description: "" });
  };
  useEffect(() => {
    const getPermissionModuleDetails = async () => {
      try {
        const res = await api.get<GetPermissionModuleResponse>(
          `${formField?.submitUrl}/${params?.["module-id"]}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setFormData({
            moduleName: respose?.moduleName,
            description: respose?.description,
          });
        }
      } catch {
        showToast({
          message: `Failed to fetch permission module.`,
          type: "error",
        });
      }
    };
    getPermissionModuleDetails();
  }, [params, formField?.submitUrl]);
  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const trimmedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );
      if (!trimmedFormData?.moduleName || !trimmedFormData?.description) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }
      const res = await api.put(`${formField?.submitUrl}`, {
        ...trimmedFormData,
        moduleId: params?.["module-id"],
      });
      if (res?.status == 200) {
        // ✅ Backend should set auth cookie via Set-Cookie
        showToast({
          message: `Permission module created successfully.`,
          type: "success",
        });
        router.push("/permission/permission-module");
      } else {
        throw new Error("Failed to create permission module.");
      }
    } catch {
      showToast({
        message: `Failed to create permission module.`,
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
            onClick={() => router.push("/permission/permission-module")}
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

export default UpdatePermissionModule;
