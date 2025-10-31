"use client";
import { FaDownload, FaPaperPlane } from "react-icons/fa";
import SendInvoiceEmailModal from "./SendInvoiceEmailModal";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function InvoiceDownloadSendButtons({
  handleDownload,
  clientID,
}: {
  handleDownload: () => void;
  clientID: string | undefined;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-row justify-between items-center max-w-4xl mx-auto">
      <div
        className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
        onClick={() => router.back()}
      >
        <IoMdArrowBack className="w-6 h-6" />
      </div>
      <div className="flex justify-end gap-3 mb-6 w-full">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm shadow"
        >
          <FaDownload />
          Download
        </button>
        {/* <button className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm shadow">
        <FaPaperPlane />
        Send
      </button> */}
        <SendInvoiceEmailModal clientID={clientID} />
      </div>
    </div>
  );
}
