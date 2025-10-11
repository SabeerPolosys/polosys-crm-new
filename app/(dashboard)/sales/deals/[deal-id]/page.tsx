"use client";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { FaDownload, FaPaperPlane } from "react-icons/fa";

export default function InvoicePage() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    // Dynamically import (important in Next.js)
    const html2pdf = (await import("html2pdf.js")).default;

    // Runtime color fix on main DOM
    const elements = invoiceRef.current.querySelectorAll("*");
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const element = el as HTMLElement;
      if (style.color.includes("lab(")) element.style.color = "#000";
      if (style.backgroundColor.includes("lab("))
        element.style.backgroundColor = "#fff";
      if (style.borderColor.includes("lab("))
        element.style.borderColor = "#ccc";
    });

    const opt = {
      margin: 0,
      filename: `quotation-${Date.now()}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",

        // 🧠 THIS is where the magic happens
        onclone: (clonedDoc: Document) => {
          clonedDoc.querySelectorAll("*").forEach((el) => {
            const style = window.getComputedStyle(el);
            const element = el as HTMLElement;
            if (style.color.includes("lab(")) element.style.color = "#000";
            if (style.backgroundColor.includes("lab("))
              element.style.backgroundColor = "#fff";
            if (style.borderColor.includes("lab("))
              element.style.borderColor = "#ccc";
          });
        },
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
    };

    // Generate PDF
    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
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
          className="bg-white shadow-lg rounded-lg overflow-hidden p-10 text-black font-sans"
        >
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-wide">Quotation</h1>
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-semibold text-black">Company Name</p>
              <p>123 Street, City, Country</p>
              <p>Email: info@company.com</p>
            </div>
          </header>

          {/* Invoice Info */}
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

          {/* Table */}
          <table className="w-full text-sm text-left border border-gray-200 mb-8">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border-b border-gray-300">Item</th>
                <th className="p-3 border-b border-gray-300 text-center">
                  Qty
                </th>
                <th className="p-3 border-b border-gray-300 text-right">
                  Unit Price
                </th>
                <th className="p-3 border-b border-gray-300 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">
                  Books Ultimate Plan
                </td>
                <td className="p-3 border-b border-gray-200 text-center">1</td>
                <td className="p-3 border-b border-gray-200 text-right">
                  $50.00
                </td>
                <td className="p-3 border-b border-gray-200 text-right">
                  $50.00
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">Books Addon</td>
                <td className="p-3 border-b border-gray-200 text-center">1</td>
                <td className="p-3 border-b border-gray-200 text-right">
                  $27.00
                </td>
                <td className="p-3 border-b border-gray-200 text-right">
                  $27.00
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="text-right text-lg font-bold border-t pt-4 border-gray-200">
            Total: $77.00
          </div>

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 mt-12 border-t pt-4 border-gray-200">
            <p>Thank you for your business!</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
