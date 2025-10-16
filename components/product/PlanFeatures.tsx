"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";
type PlanFeatureProps = {
  handleFormDataChange(key: string, value: any): void;
  value: any[];
  field: {
    key: string;
    type: string;
  };
};

export default function PlanFeatures({
  value,
  handleFormDataChange,
  field,
}: PlanFeatureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [features, setFeatures] = useState([{ featureName: "", status: true }]);
  const pathname = usePathname();

  const handleAdd = () => setFeatures([...features, { featureName: "", status: true }]);
  const handleRemove = (index: number) =>
    setFeatures(features.filter((_, i) => i !== index));

  const handleChange = (index: number, field: string, value: boolean|string) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const handleSave = () => {
    handleFormDataChange(field?.key, features);
    setIsOpen(false);
  };
  useEffect(()=>{
    if(pathname?.startsWith("/products/plan/update/")){
      setFeatures(value);
    }
  }, [value])

  return (
    <div className="">
      {/* Button to open modal */}
      <br/>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="relative flex items-center gap-2 bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer mt-2"
      >
        <FiPlus size={16} />
        Manage Plan Features
        {/* 🔴 Notification badge */}
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
          {value?.length ?? 0}
        </span>
      </button>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/25"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Panel */}
        <DialogPanel className="relative z-10 w-full max-w-3xl h-full md:h-auto md:my-auto p-6 bg-white rounded-none md:rounded-lg shadow-xl md:mr-6 overflow-y-auto">
          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <AiOutlineClose className="h-5 w-5" />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Plan Features
          </h2>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96 overflow-y-scroll">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm font-medium">
                  <th className="py-3 px-4 text-left border-b-[1px] border-gray-300">
                    Feature Name
                  </th>
                  <th className="py-3 px-4 text-left border-b-[1px] border-gray-300">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center border-b-[1px] border-gray-300"></th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-700">
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-4 border-b-[1px] border-gray-300">
                      <input
                        type="text"
                        value={feature.featureName}
                        onChange={(e) =>
                          handleChange(index, "featureName", e.target.value)
                        }
                        placeholder="Enter feature name"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="py-3 px-4 border-b-[1px] border-gray-300">
                      <div className="relative w-full">
                        <select
                          value={feature?.status?.toString()}
                          onChange={(e) =>
                            handleChange(index, "status", e.target.value === "true")
                          }
                          className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm text-gray-600 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                        >
                          <option value="">Select Status</option>
                          <option value={"true"}>Active</option>
                          <option value={"false"}>Inactive</option>
                        </select>

                        {/* Vertical Divider */}
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-px h-5 bg-gray-300 pointer-events-none"></div>

                        {/* Dropdown Arrow */}
                        <FiChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          size={16}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 border-b-[1px] border-gray-300 text-center">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemove(index)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition"
                          title="Remove Feature"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
            >
              <FiPlus size={18} />
              Add Feature
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => {
                setFeatures([{ featureName: "", status: true }]);
                handleFormDataChange(field?.key, []);
                setIsOpen(false);
              }}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
