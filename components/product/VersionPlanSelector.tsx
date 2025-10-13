"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { ProductTypes } from "@/types/auth";

type Plan = {
  name: string;
  price: string;
  currency: string;
  billingCycle: string;
  selected?: boolean;
  features?: string[];
};

export default function VersionPlanSelector({
  productDetails,
}: {
  productDetails?: ProductTypes|null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([
    {
      name: "Basic Plan",
      price: "10.00",
      currency: "USD",
      billingCycle: "Monthly",
      selected: false,
      features: ["Feature A", "Feature B"],
    },
    {
      name: "Pro Plan",
      price: "25.00",
      currency: "USD",
      billingCycle: "Annually",
      selected: true,
      features: ["Feature A", "Feature B", "Feature C"],
    },
    {
      name: "Enterprise Plan",
      price: "99.00",
      currency: "USD",
      billingCycle: "Annually",
      selected: false,
      features: ["Priority Support", "Custom Integrations", "Unlimited Users"],
    },
  ]);

  return (
    <div>
      {/* Open Modal Button */}
      {productDetails?.productTypeID === 2 && (
        <>
        <br/>
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="relative flex items-center gap-2 bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer mt-2"
        >
          <FiPlus size={16} />
          Manage Version Plans
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {plans.filter((p) => p.selected).length}
          </span>
        </button>
        </>
      ) }

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/25"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />

        {/* Dialog Panel */}
        <DialogPanel className="relative z-10 w-full max-w-3xl h-[80vh] bg-white rounded-none md:rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <AiOutlineClose className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Select Plans
            </h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition gap-4"
              >
                {/* Left: Checkbox & Name */}
                <label className="flex items-center gap-3 cursor-pointer min-w-[140px]">
                  <input
                    type="checkbox"
                    checked={plan.selected || false}
                    onChange={(e) => {
                      const updated = [...plans];
                      updated[index].selected = e.target.checked;
                      setPlans(updated);
                    }}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-800 font-medium">
                    {plan.name}
                  </span>
                </label>

                {/* Center: Plan Info */}
                <div className="flex-1 text-center space-y-1 text-sm">
                  <div className="font-semibold text-gray-900">{plan.name}</div>
                  <div className="text-gray-700">Price: ${plan.price}</div>
                  <div className="text-gray-700">Currency: {plan.currency}</div>
                  <div className="text-gray-700">
                    Billing Cycle: {plan.billingCycle}
                  </div>
                </div>

                {/* Right: Features */}
                <div className="text-sm text-gray-600 text-right min-w-[160px]">
                  <div className="font-semibold text-gray-800 mb-1">
                    Features:
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {(plan.features || []).map((feature, fIdx) => (
                      <li key={fIdx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={() => {
                setPlans((prev) =>
                  prev.map((p) => ({ ...p, selected: false }))
                );
                setIsOpen(false);
              }}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const selectedPlans = plans.filter((p) => p.selected);
                console.log("Selected Plans:", selectedPlans);
                setIsOpen(false);
              }}
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
