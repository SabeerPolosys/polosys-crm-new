"use client";
import { useRef } from "react";
import { FaDownload, FaPaperPlane } from "react-icons/fa";

export default function InvoicePage() {
  const invoiceRef = useRef<HTMLDivElement>(null);

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
  filename: `invoice-${Date.now()}.pdf`,
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
      <div className="flex justify-end gap-3 mb-6 max-w-4xl mx-auto">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm shadow"
        >
          <FaDownload />
          Download
        </button>
        <button className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm shadow">
          <FaPaperPlane />
          Send
        </button>
      </div>

      {/* Invoice Container */}
      <div
        ref={invoiceRef}
        className="max-w-4xl mx-auto p-10 bg-white shadow-lg rounded-lg font-sans text-black"
      >
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            INVOICE
          </h1>
          <div className="mt-3 text-sm text-gray-600">
            <p className="font-medium text-black">Company Name</p>
            <p>123 Street, City, Country</p>
            <p>Email: info@company.com</p>
          </div>
        </header>

        {/* Info Section */}
        <section className="flex justify-between text-sm mb-10">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
            <p className="font-medium">John Doe</p>
            <p>456 Client St, City</p>
            <p>Email: john@example.com</p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Invoice #:</span> INV-001
            </p>
            <p>
              <span className="font-semibold">Date:</span> 2025-10-10
            </p>
            <p>
              <span className="font-semibold">Due Date:</span> 2025-10-20
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
                <th className="p-3 border border-gray-300 text-right">Rate</th>
                <th className="p-3 border border-gray-300 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">
                  Books Ultimate Plan
                </td>
                <td className="p-3 border border-gray-200 text-right">1</td>
                <td className="p-3 border border-gray-200 text-right">
                  $50.00
                </td>
                <td className="p-3 border border-gray-200 text-right">
                  $50.00
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">Books Addon</td>
                <td className="p-3 border border-gray-200 text-right">2</td>
                <td className="p-3 border border-gray-200 text-right">
                  $10.00
                </td>
                <td className="p-3 border border-gray-200 text-right">
                  $20.00
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={3}
                  className="p-3 border-t border-gray-300 text-right font-semibold"
                >
                  Subtotal
                </td>
                <td className="p-3 border-t border-gray-300 text-right">
                  $70.00
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="p-3 text-right font-semibold">
                  Tax (10%)
                </td>
                <td className="p-3 text-right">$7.00</td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className="p-3 text-right font-bold text-blue-700 border-t border-gray-300"
                >
                  Total
                </td>
                <td className="p-3 text-right font-bold text-blue-700 border-t border-gray-300">
                  $77.00
                </td>
              </tr>
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
