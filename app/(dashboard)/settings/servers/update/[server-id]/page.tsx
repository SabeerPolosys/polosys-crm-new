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
import { ServerType } from "@/types/auth";

interface ServerFormData {
  serverName: string;
  region: string;
  ipAddress: string;
  remarks: string;
  isActive: boolean;
  isDefault: boolean;
  databaseLimit: number | null;
  validity: Date | null;
}
type ServerResponseData = {
  success: boolean;
  message: string;
  data: ServerType;
};

const UpdateServer: React.FC = () => {
  const [formData, setFormData] = useState<ServerFormData>({
    serverName: "",
    region: "",
    ipAddress: "",
    remarks: "",
    isActive: true,
    isDefault: false,
    databaseLimit: null,
    validity: null,
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
      serverName: "",
      region: "",
      ipAddress: "",
      remarks: "",
      isActive: true,
      isDefault: false,
      databaseLimit: null,
      validity: null,
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
        !trimmedFormData?.serverName ||
        !trimmedFormData?.region ||
        !trimmedFormData?.ipAddress ||
        // !trimmedFormData?.databaseLimit ||
        !trimmedFormData?.remarks ||
        !trimmedFormData?.validity
      ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }

      const res = await api.put(`${formField?.submitUrl}`, {...trimmedFormData, serverID: params?.["server-id"]});
      if (res?.status == 200) {
        showToast({
          message: `Server created successfully.`,
          type: "success",
        });
        router.push("/settings/servers");
      } else {
        throw new Error("Failed to create server.");
      }
    } catch {
      showToast({
        message: `Failed to create server.`,
        type: "error",
      });
    }
  };
  useEffect(() => {
    const getGatewayDetails = async () => {
      try {
        const res = await api.get<ServerResponseData>(
          `/api/v1/server/${params?.["server-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setFormData({
            serverName: response?.serverName,
            region: response?.region,
            ipAddress: response?.ipAddress,
            remarks: response?.remarks,
            isActive: response?.isActive,
            isDefault: response?.isDefault,
            databaseLimit: response?.databaseLimit,
            validity: response?.validity,
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

export default UpdateServer;
