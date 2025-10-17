"use client";
import api from "@/lib/axios";
import { PlanType } from "@/types/auth";
import { useEffect, useState } from "react";
import { TiTick, TiTimes } from "react-icons/ti";
import { showToast } from "../common/ShowToast";
import { getBillingCycle } from "@/helpers/helperFunction";
interface GetPlanDetailsResponse {
  success: boolean;
  message: string;
  data: PlanType;
}

export default function PlanViewCard({ planID }: { planID: string }) {
  const [planDetails, setPlanDetails] = useState<PlanType | null>(null);
  useEffect(() => {
    const getPlanDetails = async () => {
      try {
        const res = await api.get<GetPlanDetailsResponse>(
          `/api/v1/product-plan/${planID}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setPlanDetails(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch plan details.`,
          type: "error",
        });
      }
    };
    getPlanDetails();
  }, [planID]);
  return (
    <div className="rounded-lg shadow-lg p-4 bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200">
      <div className="text-center flex flex-col gap-1">
        <h3 className="font-semibold text-gray-700 text-lg">
          {planDetails?.planName}
        </h3>
        <p className="font-bold text-purple-600 text-xl">
          &#8377; {planDetails?.planPrice?.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">
          {getBillingCycle(planDetails?.billingCycle ?? 0)} /{" "}
          {planDetails?.code}
        </p>
        <p className="text-gray-600 text-sm">
          Best for large organizations with custom needs.
        </p>
      </div>
      <div className="flex justify-center text-sm mt-4">
        <ul className="leading-7">
          {planDetails?.features?.map((feature) => {
            return (
              <li
                className="flex flex-row items-center gap-2"
                key={feature?.featureID}
              >
                {feature?.status ? <TiTick /> : <TiTimes />}
                {feature?.featureName}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
