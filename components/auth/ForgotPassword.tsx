"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { showToast } from "../common/ShowToast";
import api from "@/lib/axios";
// import toast from 'react-hot-toast'

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
type ResetResponse = {success: boolean};

export default function ForgotPassword({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  function isValidEmail(email: string) {
    if (!email || typeof email !== "string" || email.trim() === "") {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSubmit = async () => {
    try {
      if (!isValidEmail(email)) {
        if (emailRef?.current) emailRef?.current.focus();
        return showToast({
          message: "Please enter a valid email.",
          type: "error",
        });
      }
      setIsLoading(true);
      const res = await api.post<ResetResponse>(
        `/api/v1/auth/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (res?.status == 200) {
        showToast({
          message: `Password reset link sent to ${email}`,
          type: "success",
        });
        onClose();
      } else {
        throw new Error("Mail sending failed.");
      }
    } catch {
      showToast({ message: "Failed to reset password.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!isOpen) setEmail("");
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-end mr-30"
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
        <h2 className="text-lg font-semibold mb-4">Forgot Password</h2>

        {/* Form */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={emailRef}
          />
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
              Verifying...
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 cursor-pointer"
            >
              Send Reset Link
            </button>
          )}
        </div>
      </DialogPanel>
    </Dialog>
  );
}
