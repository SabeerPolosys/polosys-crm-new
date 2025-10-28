"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";


export default function StatusUpdateModal({
  status,
  colour,
  options,
  handleSubmit,
  submitData,
  updateKey,
  canEdit,
  setUpdateStatus
}: {
  status: string;
  colour: string;
  options: { value: string; key: string }[];
  handleSubmit?: (data: any) => Promise<boolean>;
  submitData: any;
  updateKey?: string;
  canEdit?: boolean;
  setUpdateStatus?: Dispatch<SetStateAction<number>>
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleSave = async () => {
    const result = (await (handleSubmit && handleSubmit({...submitData, [updateKey ?? ""]: selectedStatus}))) ?? false;
    result && closeModal();
    result && setUpdateStatus && setUpdateStatus(prev=> prev+1);
  };

  return (
    <>
      {/* Status Badge */}
      <div>
        <span
          className={`${colour} px-3 py-1 rounded-2xl cursor-pointer`}
          onClick={canEdit ? openModal : ()=>{}}
        >
          {status}
        </span>
      </div>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/25"
          aria-hidden="true"
          onClick={closeModal}
        />

        {/* Dialog Panel */}
        <DialogPanel className="relative z-10 w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <AiOutlineClose className="h-5 w-5" />
          </button>

          {/* Modal Title */}
          <h2 className="text-lg font-semibold mb-4">Update Status</h2>

          {/* Status Dropdown */}
          <div>
            <label
              htmlFor={"status"}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select new status
            </label>
            <div className="relative w-full">
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
              >
                {options?.map((option, index) => {
                  return (
                    <option value={option?.key} key={index}>
                      {option?.value}
                    </option>
                  );
                })}
              </select>

              {/* Custom Arrow Icon with space after */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <FiChevronDown className="text-gray-600" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
