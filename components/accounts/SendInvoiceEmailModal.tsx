"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";
import { FaPaperPlane } from "react-icons/fa";
import api from "@/lib/axios";
import { showToast } from "../common/ShowToast";
import { TiTick } from "react-icons/ti";
import { FaXmark } from "react-icons/fa6";
import { useParams } from "next/navigation";

export default function SendInvoiceEmailModal({
  clientID,
}: {
  clientID: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitDisable, setIsSubmitDisabled] = useState(true);
  const [emails, setEmails] = useState([
    { id: 1, email: "", isDeleted: false },
  ]);
  const params = useParams();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  useEffect(() => {
    const getAllCustomerEmails = async () => {
      try {
        if (!isOpen || !clientID) return;
        const res = await api.get<any>(`/api/v1/common/emails/${clientID}`);
        if (res?.data?.success) {
          const response = res?.data?.data;
          setEmails(
            response?.map((email: string, index: number) => ({
              id: index + 1,
              email,
              isDeleted: false,
            }))
          );
        }
      } catch {
        showToast({
          message: `Failed to fetch customer emails.`,
          type: "error",
        });
      }
    };
    getAllCustomerEmails();
  }, [isOpen]);
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const allValid = emails
      .filter((e) => !e.isDeleted)
      .every((e) => e.email.trim() !== "" && emailRegex.test(e.email.trim()));

    setIsSubmitDisabled(!allValid);
  }, [emails]);
  const handleSubmit = async () => {
    try {
      const sendEmails = emails
        ?.filter((e) => !e.isDeleted)
        ?.map((e) => e?.email);
      const res = await api.post<any>(
        `/api/v1/invoice/send/${params?.["invoice-id"]}`,
        sendEmails
      );
      if (res?.data?.success) {
        closeModal();
        showToast({
          message: `Invoice send successfully.`,
          type: "success",
        });
      }
    } catch {
      showToast({
        message: `Failed to send invoice.`,
        type: "error",
      });
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm shadow"
      >
        <FaPaperPlane />
        Send
      </button>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="fixed inset-0 bg-black/25"
          aria-hidden="true"
          onClick={closeModal}
        />

        <DialogPanel className="relative z-10 w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <AiOutlineClose className="h-5 w-5" />
          </button>

          <h2 className="text-lg font-semibold mb-4">
            Select Emails To Send Invoice
          </h2>

          {emails?.map((email, index) => {
            return (
              <div key={index} className="mt-2 flex flex-row items-center">
                <input
                  type="email"
                  value={email?.email}
                  onChange={(e) =>
                    setEmails((prev) =>
                      prev?.map((emailDetails) =>
                        emailDetails?.id === email?.id
                          ? { ...emailDetails, email: e.target.value }
                          : emailDetails
                      )
                    )
                  }
                  placeholder={"email"}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    email?.isDeleted ? "cursor-not-allowed bg-gray-50" : ""
                  }`}
                  disabled={email?.isDeleted}
                />
                <div>
                  {email?.isDeleted ? (
                    <FaXmark
                      className="w-5 h-5 cursor-pointer text-red-500"
                      onClick={() =>
                        setEmails((prev) =>
                          prev?.map((emailDetails) =>
                            emailDetails?.id === email?.id
                              ? { ...emailDetails, isDeleted: false }
                              : emailDetails
                          )
                        )
                      }
                    />
                  ) : (
                    <TiTick
                      className="w-5 h-5 text-green-500"
                      onClick={() =>
                        setEmails((prev) =>
                          prev?.map((emailDetails) =>
                            emailDetails?.id === email?.id
                              ? { ...emailDetails, isDeleted: true }
                              : emailDetails
                          )
                        )
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
          <p
            className="mt-2 text-xs text-gray-600 cursor-pointer hover:underline"
            onClick={() =>
              setEmails((prev) => {
                const nextId =
                  prev.length > 0 ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
                return [...prev, { id: nextId, email: "", isDeleted: false }];
              })
            }
          >
            Add New Email
          </p>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={isSubmitDisable ? () => {} : handleSubmit}
              disabled={isSubmitDisable}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-50"
              title={`${isSubmitDisable ? "Enter valid emails" : ""}`}
            >
              Send
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
