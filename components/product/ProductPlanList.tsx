"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { showToast } from "../common/ShowToast";
import api from "@/lib/axios";
import PlanDetailsCard from "./PlanDetailsCard";

export default function ProductPlanList({
  pcode,
  name,
  productID,
}: {
  pcode: string | undefined;
  name: string | undefined;
  productID: string | undefined;
}) {
  const [coutries, setCountries] = useState<any[]>([]);
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Yearly">(
    "Monthly"
  );
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  const toggleBilling = () => {
    setBillingCycle((prev) => (prev === "Monthly" ? "Yearly" : "Monthly"));
  };
  useEffect(() => {
    const getAvailableContries = async () => {
      try {
        if (!pcode) return;
        const res = await api.get(
          `/api/v1/product-plan/countrieslist-/${pcode}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setCountries(response || []);
          if (response?.length > 0) {
            setSelectedCountry(response?.[0]?.countryId);
          }
        }
      } catch {
        showToast({
          message: `Failed to fetch available countries.`,
          type: "error",
        });
      }
    };
    getAvailableContries();
  }, [pcode]);
  useEffect(() => {
    const getPlans = async () => {
      try {
        if (!pcode || !selectedCountry) return;
        const existingCountryPlans = await api.get(
          `/api/v1/product-plan/plan-pcode-country?pcode=${pcode}&countryid=${selectedCountry}`
        );
        if (existingCountryPlans?.data?.success) {
          setAvailablePlans(
            billingCycle === "Monthly"
              ? existingCountryPlans?.data?.data?.monthlyPlans ?? []
              : existingCountryPlans?.data?.data?.yearlyPlans ?? []
          );
        }
      } catch {
        showToast({
          message: `Failed to fetch plans.`,
          type: "error",
        });
      }
    };
    getPlans();
  }, [pcode, selectedCountry, billingCycle]);
  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h3 className="my-6 text-xl font-semibold">
          Plans Of {name} ({pcode})
        </h3>
        <Link
          href={`/products/editions/create-plans?productCode=${pcode}&productName=${name}&productId=${productID}`}
          className="px-2 py-1 rounded bg-gray-800 text-white text-sm cursor-pointer"
        >
          + Create Plans
        </Link>
      </div>
      <div>
        <div className="flex flex-row items-center justify-between">
          <div className="relative">
            <select
              value={selectedCountry ?? ""}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-80 px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
            >
              {coutries?.length <= 0 && <option value="">Select</option>}
              {coutries?.map((country) => (
                <option value={country?.countryId} key={country?.countryId}>
                  {country?.countryName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <FiChevronDown className="text-gray-600" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={
                billingCycle === "Monthly" ? "font-bold" : "text-gray-500"
              }
            >
              Monthly
            </span>

            <button
              onClick={toggleBilling}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                billingCycle === "Monthly" ? "bg-gray-300" : "bg-blue-500"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  billingCycle === "Yearly" ? "translate-x-6" : ""
                }`}
              ></span>
            </button>

            <span
              className={
                billingCycle === "Yearly" ? "font-bold" : "text-gray-500"
              }
            >
              Yearly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          {availablePlans?.map((plan:any) => {
            return <PlanDetailsCard plan={plan} key={plan?.planID}/>;
          })}
        </div>
      </div>
    </div>
  );
}
