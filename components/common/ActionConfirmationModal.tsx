"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { showToast } from "./ShowToast";

type ActionConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void>; // any async action
};

export default function ActionConfirmationModal({
  isOpen,
  onClose,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  onConfirm,
}: ActionConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      showToast({
        message: `Failed to perform action.`,
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
      <div
        className="fixed inset-0 bg-black/25"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <DialogPanel className="relative z-10 w-full max-w-sm h-full md:h-auto md:my-auto p-6 bg-white rounded-none md:rounded-lg shadow-xl md:mr-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          aria-label="Close"
        >
          <AiOutlineClose className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {/* Message */}
        <p className="text-sm text-gray-600">{message}</p>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
          >
            {cancelLabel}
          </button>
          {isLoading ? (
            <button
              disabled
              className="px-4 py-2 rounded-md bg-gray-500 opacity-70 text-white cursor-not-allowed flex items-center justify-center"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Processing...
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </DialogPanel>
    </Dialog>
  );
}
