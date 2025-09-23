"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { showToast } from "../common/ShowToast";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deleteLabel?: string;
  deleteId: string;
  deleteUrl: string;
  redirectUrl: string;
};
type DeleteResponse = {};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  deleteLabel,
  deleteId,
  deleteUrl,
  redirectUrl,
}: ForgotPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await api.delete<DeleteResponse>(`${deleteUrl}${deleteId}`);
      if (res?.status == 200) {
        showToast({
          message: `${deleteLabel} deleted successfuly`,
          type: "success",
        });
        onClose();
        router.push(`${redirectUrl}`);
      } else {
        throw new Error("Operation failed.");
      }
    } catch (err) {
      showToast({
        message: `Failed to to delete ${deleteLabel}.`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <DialogPanel className="relative z-10 w-full max-w-sm h-full md:h-auto md:my-auto p-6 bg-white rounded-none md:rounded-lg shadow-xl md:mr-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          aria-label="Close"
        >
          <AiOutlineClose className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-lg font-semibold mb-4">Delete {deleteLabel}</h2>

        {/* Form */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete {deleteLabel}? You can't undo this
            action !
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          {isLoading ? (
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-md bg-gray-500 opacity-70 text-white hover:bg-gray-900 cursor-not-allowed flex items-center justify-center"
            >
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Deleting...
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-400 text-white hover:bg-red-500 cursor-pointer"
            >
              Confirm
            </button>
          )}
        </div>
      </DialogPanel>
    </Dialog>
  );
}
