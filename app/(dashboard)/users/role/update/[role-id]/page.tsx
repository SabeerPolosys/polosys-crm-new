"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";
import { useParams } from "next/navigation";
import { RoleType } from "@/types/auth";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";

interface RoleFormData {
  typeName: string;
  description: string;
}
type GetRoleResponse = {
  success: boolean;
  message: string;
  data: RoleType;
};

const EditRoleForm: React.FC = () => {
  const [formData, setFormData] = useState<RoleFormData>({
    typeName: "",
    description: "",
  });
  const router = useRouter();
  const pathname = usePathname();
  const trimmedPath = pathname.split("/").slice(0, -2).join("/") || "/";
  const formField =
    formFieldconfig[trimmedPath as keyof typeof formFieldconfig];
  const params = useParams();

  useEffect(() => {
    const getRoleDetails = async () => {
    try {
      const res = await api.get<GetRoleResponse>(
        `${formField?.submitUrl}/${params?.["role-id"]}`
      );
      if (res?.data?.message) {
        const respose = res?.data?.data;
        setFormData({
          typeName: respose?.typeName,
          description: respose?.description,
        });
      }
    } catch {
      showToast({
        message: `Failed to fetch role.`,
        type: "error",
      });
    }
  };
    getRoleDetails();
  },[params, formField?.submitUrl]);

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
      const res = await api.put(`${formField?.submitUrl}`, {...trimmedFormData, userTypeId: params?.["role-id"]});
      if (res?.status == 200) {
        showToast({
          message: `Role updated successfully.`,
          type: "success",
        });
        router.push("/users");
      } else {
        throw new Error("Failed to create role.");
      }
    } catch (err: any) {
      if (
        err?.response?.data?.message ===
        "Violation of UNIQUE KEY constraint 'UQ__user_typ__D4E7DFA8649C4C50'. Cannot insert duplicate key in object 'dbo.user_types'. The duplicate key value is (New test three).\r\nThe statement has been terminated."
      ) {
        return showToast({
          message: `Already exist same role, please try different role.`,
          type: "error",
        });
      }
      showToast({
        message: `Failed to update role.`,
        type: "error",
      });
    }
  };

  return (
    <ValidatePermissions permissionType="edit">
    <div>
      {formField?.Category && (
        <h2 className="font-semibold text-md mb-2">{formField?.Category}</h2>
      )}
      <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div
            className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
            onClick={() => router.push("/users")}
          >
            <IoMdArrowBack className="w-6 h-6" />
          </div>
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

export default EditRoleForm;
