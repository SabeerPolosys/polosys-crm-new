"use client";
import { useState } from "react";
import { showToast } from "../common/ShowToast";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";

export default function ConvertInvoiceForm({
  handleClick,
  purchaseDetails,
}: {
  handleClick: (type: string) => void;
  purchaseDetails: any;
}) {
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const params = useParams();
  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!invoicePrefix?.trim() || !invoiceNumber?.trim()) {
        return showToast({
          message: `Please fill required fields.`,
          type: "error",
        });
      }
      const formData = new FormData();
      formData.append("prefix", invoicePrefix);
      formData.append("invoicenumber", invoiceNumber);
      const res = await api.post(
        `/api/v1/invoice/convert-from-purchase/${params?.["purchase-id"]}`,
        formData
      );
      if (res?.status == 200) {
        showToast({
          message: `Successfully converted to invoice.`,
          type: "success",
        });
        router.push(`/accounts/invoices/${res?.data?.data?.invoiceID}`);
      } else {
        throw new Error("Failed to convert invoice.");
      }
    } catch {
      showToast({
        message: `Failed to convert invoice.`,
        type: "error",
      });
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-2">
        Invoice Details
      </h2>

      {/* Invoice Prefix */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Invoice Prefix
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter prefix (e.g., INV)"
          value={invoicePrefix}
          onChange={(e) => setInvoicePrefix(e.target.value)}
        />
      </div>

      {/* Invoice Number */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Invoice Number
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter invoice number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex flex-row gap-4">
        <button
          type="button"
          onClick={() => handleClick("cancel")}
          className="w-full bg-gray-100 font-medium py-2 rounded-lg transition duration-200"
        >
          cancel
        </button>
        <button
          type="button"
          className="w-full bg-gray-700 text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
