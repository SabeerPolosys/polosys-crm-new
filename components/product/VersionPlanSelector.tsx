"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { PlanType, ProductTypes } from "@/types/auth";
import api from "@/lib/axios";
import { showToast } from "../common/ShowToast";
import { getBillingCycle } from "@/helpers/helperFunction";
import { usePathname } from "next/navigation";

type Plan = {
  // name: string;
  // price: string;
  // currency: string;
  // billingCycle: string;
  selected?: boolean;
  planID: string;
  planName: string;
  planPrice: number;
  currencyCode: string;
  billingCycle: string;
  isActive: boolean;
  code: string;
  features: {
    featureID: string;
    planID: string;
    featureName: string;
    remarks: string | null;
    status: boolean;
    createdAt: string;
    modifiedAt: string;
  }[];
};
type PlanResponseType = {
  success: boolean;
  message: string;
  data: PlanType[];
};

export default function VersionPlanSelector({
  productDetails,
  value,
  handleFormDataChange,
  field,
}: {
  productDetails?: ProductTypes | null;
  value: string[];
  handleFormDataChange(key: string, value: any): void;
  field: {
    key: string;
    type: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const getAllPlans = async () => {
      try {
        const res = await api.get<PlanResponseType>(`/api/v1/product-plan`);
        if (res?.data?.success) {
          const response = res?.data?.data;
          setPlans(
            response?.map((plan) => ({
              selected:
                pathname?.startsWith("/products/version/update") &&
                value?.includes(plan?.planID),
              planID: plan?.planID,
              planName: plan?.planName,
              planPrice: plan?.planPrice,
              currencyCode: plan?.currencyCode,
              billingCycle: plan?.billingCycle,
              isActive: plan?.isActive,
              code: plan?.code,
              features: plan?.features,
            })) ?? []
          );
        }
      } catch {
        showToast({
          message: `Failed to fetch plans.`,
          type: "error",
        });
      }
    };
    getAllPlans();
  }, [value]);

  const handleSave = () => {
    const selectedPlanIDs = plans
      .filter((p) => p.selected)
      .map((p) => p.planID);
    setIsOpen(false);
    handleFormDataChange(field?.key, selectedPlanIDs);
  };

  return (
    <div>
      {/* Open Modal Button */}
      {productDetails?.productTypeID === 2 && (
        <>
          <br />
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="relative flex items-center gap-2 bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer mt-2"
          >
            <FiPlus size={16} />
            Manage Version Plans
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {value?.length ?? 0}
            </span>
          </button>
        </>
      )}

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
                    {plan?.planName}
                  </span>
                </label>

                {/* Center: Plan Info */}
                <div className="flex-1 text-center space-y-1 text-sm">
                  <div className="font-semibold text-gray-900">
                    {plan?.planName}
                  </div>
                  <div className="text-gray-700">Price: {plan?.planPrice}</div>
                  <div className="text-gray-700">
                    Currency: {plan?.currencyCode}
                  </div>
                  <div className="text-gray-700">
                    Billing Cycle: {getBillingCycle(plan?.billingCycle)}
                  </div>
                  <div className="text-gray-700">
                    Plan Code: {getBillingCycle(plan?.code)}
                  </div>
                </div>

                {/* Right: Features */}
                <div className="text-sm text-gray-600 text-right min-w-[160px]">
                  <div className="font-semibold text-gray-800 mb-1">
                    Features:
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {(plan?.features || [])?.map((feature, fIdx) => (
                      <li key={fIdx}>{feature?.featureName}</li>
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
