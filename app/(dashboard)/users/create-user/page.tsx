"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaUserCog, FaSave, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import { usePathname } from "next/navigation";
import SbForm from "@/components/form/SbForm";
import { IoMdArrowBack } from "react-icons/io";

interface UserFormData {
  userName: string;
  userEmail: string;
  passwordHash: string;
  userTypeId: string;
  clientID: string;
  isActive: boolean;
  countryID: string;
  source: string;
  status: number | null;
}

const CreateUser: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    userName: "",
    userEmail: "",
    passwordHash: "",
    userTypeId: "",
    clientID: "446AB3D0-E063-42E1-A514-05904D84A7C0",
    isActive: true,
    countryID: "",
    source: "Plosys",
    status: 1,
  });
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
      userName: "",
      userEmail: "",
      passwordHash: "",
      userTypeId: "",
      clientID: "446AB3D0-E063-42E1-A514-05904D84A7C0",
      isActive: true,
      countryID: "",
      source: "Plosys",
      status: 1,
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
      if (!trimmedFormData?.userName || !trimmedFormData?.userEmail || !trimmedFormData?.passwordHash || !trimmedFormData?.userTypeId || !trimmedFormData?.clientID || !trimmedFormData?.countryID ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }
      
      const res = await api.post(`${formField?.submitUrl}`, trimmedFormData);
      if (res?.status == 200) {
        showToast({
          message: `User created successfully.`,
          type: "success",
        });
        router.push("/users");
      } else {
        throw new Error("Failed to create user.");
      }
    } catch (err: any) {
      showToast({
        message: `Failed to create user.`,
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
            onClick={() => router.push("/users")}
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
  );
};

export default CreateUser;
