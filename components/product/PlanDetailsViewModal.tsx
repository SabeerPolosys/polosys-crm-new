"use client";

import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import {
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { Fragment } from "react";

type Feature = {
  featureID: string;
  planID: string;
  featureName: string;
  remarks: string | null;
  status: boolean;
  createdAt: Date;
  modifiedAt: Date;
};

type PlanFeaturesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  features: Feature[];
};

export default function PlanDetailsViewModal({
  isOpen,
  onClose,
  features,
}: PlanFeaturesModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onClose}
      >
        {/* Backdrop with fade */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95 translate-y-4"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-4"
        >
          <DialogPanel className="relative z-10 w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-300 to-gray-800 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-wide">
                Plan Features
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <AiOutlineClose className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition"
                  >
                    {feature?.status ? (
                      <AiOutlineCheckCircle className="text-green-500 mt-0.5 w-5 h-5 flex-shrink-0 animate-pulse" />
                    ) : (
                      <AiOutlineCloseCircle className="text-red-500 mt-0.5 w-5 h-5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {feature?.featureName}
                      </p>
                      {/* {feature.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {feature.description}
                        </p>
                      )} */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-gray-300 to-gray-800 text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
