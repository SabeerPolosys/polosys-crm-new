"use client";
import InvoiceDownloadSendButtons from "@/components/accounts/InvoiceDownloadSendButtons";
import { showToast } from "@/components/common/ShowToast";
import { formatDateToDDMMYYYY } from "@/helpers/helperFunction";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
interface InvoiceDetail {
  description: string;
  quantity: number;
  itemPrice: number;
  category: string;
}

interface Invoice {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  clientName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  region: string;
  amount: number;
  taxAmount: number;
  total: number;
  paymentID: string;
  invoiceDate: string;
  details: InvoiceDetail[];
  transactionRef: string;
  clientID: string;
}

type GetInvoiceResponse = {
  success: boolean;
  message: string;
  data: Invoice;
};

export default function InvoicePage() {
  const [invoiceDetails, setInvoiceDetails] = useState<Invoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        const res = await api.get<GetInvoiceResponse>(
          `/api/v1/invoice/${params?.["invoice-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setInvoiceDetails(response ?? null);
        }
      } catch {
        showToast({
          message: `Failed to fetch invoice details.`,
          type: "error",
        });
      }
    };
    getAllInvoices();
  }, []);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;

    // Convert unsupported lab() colors to rgb() fallback
    const elements = invoiceRef.current.querySelectorAll("*");
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);

      const element = el as HTMLElement;

      if (style.color.includes("lab(")) {
        element.style.color = "#000";
      }
      if (style.backgroundColor.includes("lab(")) {
        element.style.backgroundColor = "#fff";
      }
      if (style.borderColor.includes("lab(")) {
        element.style.borderColor = "#ccc";
      }
    });

    const opt = {
      margin: 0,
      filename: `invoice-${params?.["invoice-id"]}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc: any) => {
          clonedDoc.querySelectorAll("*").forEach((el: any) => {
            const style = window.getComputedStyle(el);
            if (style.color.includes("lab(")) {
              (el as HTMLElement).style.color = "#000";
            }
            if (style.backgroundColor.includes("lab(")) {
              (el as HTMLElement).style.backgroundColor = "#fff";
            }
          });
        },
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      {/* Buttons */}
      <InvoiceDownloadSendButtons handleDownload={handleDownload} clientID={invoiceDetails?.clientID}/>

      {/* Invoice Container */}
      <div
        ref={invoiceRef}
        className="max-w-4xl mx-auto p-10 bg-white shadow-lg rounded-lg font-sans text-black"
      >
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">INVOICE</h1>
          <div className="mt-3 text-sm text-gray-600">
            <p className="font-medium text-black">Polosys Technologies L.L.P</p>
            <p>Neospace, KINFRA Techno-Industrial Park,</p>
            <p>University, Kakkanchery, Kozhikode, Kerala 673634</p>
            <p>Email: info@company.com</p>
          </div>
        </header>

        {/* Info Section */}
        <section className="flex justify-between text-sm mb-10">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
            <p className="font-medium">{invoiceDetails?.clientName}</p>
            <p>
              {invoiceDetails?.addressLine1}, {invoiceDetails?.addressLine2}
            </p>
            <p>
              {invoiceDetails?.city}, {invoiceDetails?.region},{" "}
              {invoiceDetails?.postalCode}
            </p>
            <p>Email: {invoiceDetails?.email}</p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Invoice #:</span>{" "}
              {invoiceDetails?.invoiceNumber}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {invoiceDetails?.date &&
                formatDateToDDMMYYYY(invoiceDetails?.date)}
            </p>
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {invoiceDetails?.dueDate &&
                formatDateToDDMMYYYY(invoiceDetails?.dueDate)}
            </p>
            <p>
              <span className="font-semibold">Payment ID:</span>{" "}
              {invoiceDetails?.transactionRef}
            </p>
          </div>
        </section>

        {/* Invoice Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 border border-gray-300">Description</th>
                <th className="p-3 border border-gray-300 text-right">Qty</th>
                <th className="p-3 border border-gray-300 text-right">Type</th>
                <th className="p-3 border border-gray-300 text-right">Rate</th>
                <th className="p-3 border border-gray-300 text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetails?.details?.map((product, index) => {
                return (
                  <tr className="hover:bg-gray-50" key={index}>
                    <td className="p-3 border border-gray-200">
                      {product?.description}
                    </td>
                    <td className="p-3 border border-gray-200 text-right">
                      {product?.quantity}
                    </td>
                    <td className="p-3 border border-gray-200 text-right">
                      {product?.category}
                    </td>
                    <td className="p-3 border border-gray-200 text-right">
                      {product?.itemPrice}
                    </td>
                    <td className="p-3 border border-gray-200 text-right">
                      {(product?.quantity ?? 1) * product?.itemPrice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {(() => {
                const subtotal =
                  invoiceDetails?.details?.reduce(
                    (sum, item) =>
                      sum + (item.quantity ?? 1) * (item.itemPrice ?? 0),
                    0
                  ) ?? 0;

                const taxRate = 0.18;
                const taxAmount = subtotal * taxRate;

                const total = subtotal + taxAmount;

                return (
                  <>
                    <tr>
                      <td
                        colSpan={4}
                        className="p-3 border-t border-gray-300 text-right font-semibold"
                      >
                        Subtotal
                      </td>
                      <td className="p-3 border-t border-gray-300 text-right">
                        {subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-3 text-right font-semibold">
                        Tax (18%)
                      </td>
                      <td className="p-3 text-right">
                        {taxAmount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={4}
                        className="p-3 text-right font-bold text-blue-700 border-t border-gray-300"
                      >
                        Total
                      </td>
                      <td className="p-3 text-right font-bold text-blue-700 border-t border-gray-300">
                        {total.toFixed(2)}
                      </td>
                    </tr>
                  </>
                );
              })()}
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 mt-12 border-t pt-4">
          <p>Thank you for your business!</p>
        </footer>
      </div>
    </div>
  );
}
