"use client";

import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { formFieldconfig } from "@/config/formConfig";
import SbForm from "@/components/form/SbForm";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "../permissions/PermissionCheckerNew";

interface AddonsFormData {
  name: string;
  description: string;
  addonPrice: number | null;
  currencyID: string | null;
}

export default function CreateAddonModal({
  setRefetch,
}: {
  setRefetch: Dispatch<SetStateAction<number>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddonsFormData>({
    name: "",
    description: "",
    addonPrice: null,
    currencyID: null,
  });

  const trimmedPath = "/products/addons";
  const formField =
    formFieldconfig[trimmedPath as keyof typeof formFieldconfig];

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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
      addonPrice: null,
      currencyID: null,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const trimmedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );

      if (
        !trimmedFormData?.name ||
        !trimmedFormData?.description ||
        !trimmedFormData?.addonPrice ||
        !trimmedFormData?.currencyID
      ) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }

      const res = await api.post(`${formField?.submitUrl}`, trimmedFormData);
      if (res?.status == 200) {
        showToast({
          message: `Add-ons created successfully.`,
          type: "success",
        });
        closeModal();
        setFormData({
          name: "",
          description: "",
          addonPrice: null,
          currencyID: null,
        });
        setRefetch((prev) => prev + 1);
      } else {
        throw new Error("Failed to create add-ons.");
      }
    } catch {
      showToast({
        message: `Failed to create add-ons.`,
        type: "error",
      });
    }
  };
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    "/products/addons",
    "canCreate",
    permissions || []
  );

  return (
    <>
      {/* Trigger Button */}
      {canCreate ? (
        <button
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded cursor-pointer"
          onClick={openModal}
        >
          Create Add-ons
        </button>
      ) : null}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/25"
          aria-hidden="true"
          onClick={closeModal}
        />

        {/* Dialog Panel */}
        <DialogPanel className="relative z-10 w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <AiOutlineClose className="h-5 w-5" />
          </button>

          {/* Form Content */}
          <ValidatePermissions
            permissionType="canCreate"
            path={"/products/addons"}
          >
            <div>
              {formField?.Category && (
                <h2 className="font-semibold text-md mb-2">
                  {formField?.Category}
                </h2>
              )}
              <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center mb-6">
                  <div
                    className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
                    onClick={closeModal}
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
                />
              </div>
            </div>
          </ValidatePermissions>
        </DialogPanel>
      </Dialog>
    </>
  );
}
