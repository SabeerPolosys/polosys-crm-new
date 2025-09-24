"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import { rightsFormConfig } from "@/config/permissionsFormConfig";

interface RoleFormData {
  typeName: string;
  description: string;
}

const UpdatePermissionOption: React.FC = () => {
  const [formData, setFormData] = useState<RoleFormData>({
    typeName: "",
    description: "",
  });
  const router = useRouter();
  const pathname = usePathname();
  const trimmedPath = pathname.split("/").slice(0, -2).join("/") || "/";
  const formField = rightsFormConfig[trimmedPath as keyof typeof rightsFormConfig];

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClear = () => {
    setFormData({ typeName: "", description: "" });
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
      if (!trimmedFormData?.typeName || !trimmedFormData?.description) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }
      const res = await api.post(`${formField?.submitUrl}`, trimmedFormData);
      if (res?.status == 200) {
        // ✅ Backend should set auth cookie via Set-Cookie
        showToast({
          message: `Role created successfully.`,
          type: "success",
        });
        router.push("/users");
      } else {
        throw new Error("Failed to create role.");
      }
    } catch (err: any) {
      if (
        err?.response?.data?.message ===
        "Violation of UNIQUE KEY constraint \u0027UQ__user_typ__D4E7DFA8649C4C50\u0027. Cannot insert duplicate key in object \u0027dbo.user_types\u0027. The duplicate key value is (test).\r\nThe statement has been terminated."
      ) {
        return showToast({
          message: `Already exist same role.`,
          type: "error",
        });
      }
      showToast({
        message: `Failed to create role.`,
        type: "error",
      });
    }
  };

  return (
    <div>
      {formField?.Category && (
        <h2 className="font-semibold text-md mb-2">{formField?.Category}</h2>
      )}
      <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div
            className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
            onClick={() => router.push("/settings/permission-options")}
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
  );
};

export default UpdatePermissionOption;
