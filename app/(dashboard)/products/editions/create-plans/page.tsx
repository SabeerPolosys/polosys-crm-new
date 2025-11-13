"use client";
import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import { ProductEdition } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { HiMiniXMark } from "react-icons/hi2";
import { IoMdArrowBack } from "react-icons/io";
type GetProductEditionResponse = {
  success: boolean;
  message: string;
  data: ProductEdition[];
};

export default function CreatePlan() {
  const [countries, setCountries] = useState<any[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [editionDetails, setEditionDetails] = useState<ProductEdition[]>([]);
  const [productPlans, setProductPlans] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const productCode = searchParams.get("productCode");
  const productName = searchParams.get("productName");
  const productId = searchParams.get("productId");
  const router = useRouter();
  useEffect(() => {
    setProductPlans([
      {
        id: 1,
        countryName: "",
        countryId: "",
        isCollapsed: false,
        countryCode: "",
        monthlyPlans: editionDetails?.map((edition) => ({
          planName: "",
          planPrice: null,
          billingCycle: "Monthly",
          isActive: true,
          code: "",
          offerPrice: null,
          description: "",
          editionID: edition?.editionId,
          editionName: edition?.eName,
          editionCode: edition?.eCode,
          features: [],
        })),
        yearlyPlans: editionDetails?.map((edition) => ({
          planName: "",
          planPrice: null,
          billingCycle: "Yearly",
          isActive: true,
          code: "",
          offerPrice: null,
          description: "",
          editionID: edition?.editionId,
          editionName: edition?.eName,
          editionCode: edition?.eCode,
          features: [],
        })),
      },
    ]);
  }, [editionDetails]);
  useEffect(() => {
    const getAllCountries = async () => {
      try {
        setIsCountryLoading(true);
        const res = await api.get(`/api/v1/common/countries`);
        if (res?.data?.success) {
          const response = res?.data?.data;
          setCountries(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch countries.`,
          type: "error",
        });
      } finally {
        setIsCountryLoading(false);
      }
    };
    getAllCountries();
  }, []);
  useEffect(() => {
    const getProductEditions = async () => {
      try {
        if (!productCode) return;
        const res = await api.get<GetProductEditionResponse>(
          `/api/v1/edition/by-pcode/${productCode}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setEditionDetails(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch product editions.`,
          type: "error",
        });
      }
    };
    getProductEditions();
  }, [productCode]);
  const setCollapse = (planId: number, status: boolean) => {
    setProductPlans((prev) =>
      prev?.map((plan) =>
        plan?.id === planId ? { ...plan, isCollapsed: status } : plan
      )
    );
  };
  const AddNewRow = () => {
    setProductPlans((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      const updatedPlans = prev.map((plan) => ({
        ...plan,
        isCollapsed: true,
      }));
      const newPlan = {
        id: nextId,
        countryName: "",
        countryId: "",
        isCollapsed: false,
        countryCode: "",
        monthlyPlans: editionDetails?.map((edition) => ({
          planName: "",
          planPrice: null,
          billingCycle: "Monthly",
          isActive: true,
          code: "",
          offerPrice: null,
          description: "",
          editionID: edition?.editionId,
          editionName: edition?.eName,
          editionCode: edition?.eCode,
          features: [],
        })),
        yearlyPlans: editionDetails?.map((edition) => ({
          planName: "",
          planPrice: null,
          billingCycle: "Yearly",
          isActive: true,
          code: "",
          offerPrice: null,
          description: "",
          editionID: edition?.editionId,
          editionName: edition?.eName,
          editionCode: edition?.eCode,
          features: [],
        })),
      };
      return [...updatedPlans, newPlan];
    });
    showToast({
      message: `New row added.`,
      type: "success",
    });
  };

  const deletePlan = (planId: number) => {
    setProductPlans((prev) => prev.filter((plan) => plan.id !== planId));
    showToast({
      message: `Row deleted successfully.`,
      type: "success",
    });
  };

  const changeCountry = async (planId: number, countryDetails: string) => {
    const [countryId, countryName, countryCode] =
      countryDetails?.split("__") ?? [];
    if (!countryId || !countryName || !countryCode) return;
    const isDuplicate = productPlans.some(
      (plan) => plan.countryId === countryId && plan.id !== planId
    );

    if (isDuplicate) {
      showToast({
        message: `Selected country already exists in another plan.`,
        type: "error",
      });
      return;
    }
    const existingCountryPlans = await api.get(
      `/api/v1/product-plan/plan-pcode-country?pcode=${productCode}&countryid=${countryId}`
    );
    if (
      existingCountryPlans?.data?.success &&
      (existingCountryPlans?.data?.data?.monthlyPlans?.length > 0 ||
        existingCountryPlans?.data?.data?.yearlyPlans?.length)
    ) {
      setProductPlans((prev) => {
        return prev.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                countryName,
                countryId,
                countryCode,
                monthlyPlans: plan?.monthlyPlans?.map((edition) => {
                  const existing =
                    existingCountryPlans?.data?.data?.monthlyPlans?.find(
                      (e) => e?.editionID === edition?.editionID
                    );
                  if (existing) {
                    return {
                      planID: existing?.planID,
                      planName: existing?.planName,
                      planPrice: existing?.planPrice,
                      billingCycle: existing?.billingCycle,
                      isActive: existing?.isActive,
                      code: existing?.code,
                      offerPrice: existing?.offerPrice,
                      description: "",
                      editionID: existing?.editionID,
                      editionName: existing?.eName,
                      editionCode: existing?.eCode,
                      isCodeVerified: true,
                    };
                  } else {
                    return {
                      ...edition,
                      planName: `${productName} ${edition?.editionName} ${countryName} Monthly`,
                      code: `${productCode}_${edition?.editionCode}_${countryCode}_M`,
                      isCodeVerified: false,
                      isChecked: false,
                    };
                  }
                }),
                yearlyPlans: plan?.yearlyPlans?.map((edition) => {
                  const existing =
                    existingCountryPlans?.data?.data?.yearlyPlans?.find(
                      (e) => e?.editionID === edition?.editionID
                    );

                  if (existing) {
                    return {
                      planID: existing?.planID,
                      planName: existing?.planName,
                      planPrice: existing?.planPrice,
                      billingCycle: existing?.billingCycle,
                      isActive: existing?.isActive,
                      code: existing?.code,
                      offerPrice: existing?.offerPrice,
                      description: "",
                      editionID: existing?.editionID,
                      editionName: existing?.eName,
                      editionCode: existing?.eCode,
                      isCodeVerified: true,
                    };
                  } else {
                    return {
                      ...edition,
                      planName: `${productName} ${edition?.editionName} ${countryName} Yearly`,
                      code: `${productCode}_${edition?.editionCode}_${countryCode}_Y`,
                      isCodeVerified: false,
                      isChecked: false,
                    };
                  }
                }),
              }
            : plan
        );
      });
      return;
    }
    setProductPlans((prev) => {
      return prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              countryName,
              countryId,
              countryCode,
              monthlyPlans: plan?.monthlyPlans?.map((edition) => ({
                ...edition,
                planName: `${productName} ${edition?.editionName} ${countryName} Monthly`,
                code: `${productCode}_${edition?.editionCode}_${countryCode}_M`,
                planPrice: edition?.planID ? null : edition?.planPrice,
                offerPrice: edition?.planID ? null : edition?.offerPrice,
                planID: null,
                isCodeVerified: false,
                isChecked: false,
              })),
              yearlyPlans: plan?.yearlyPlans?.map((edition) => ({
                ...edition,
                planName: `${productName} ${edition?.editionName} ${countryName} Yearly`,
                code: `${productCode}_${edition?.editionCode}_${countryCode}_Y`,
                planPrice: edition?.planID ? null : edition?.planPrice,
                offerPrice: edition?.planID ? null : edition?.offerPrice,
                planID: null,
                isCodeVerified: false,
                isChecked: false,
              })),
            }
          : plan
      );
    });
  };

  const changeValue = (
    field: string,
    value: string | number,
    id: string,
    type: "Monthly" | "Yearly",
    editionID: string
  ) => {
    setProductPlans((prev) =>
      prev?.map((plan) =>
        plan?.id === id
          ? {
              ...plan,
              monthlyPlans:
                type === "Monthly"
                  ? plan?.monthlyPlans?.map((edition) =>
                      edition?.editionID === editionID
                        ? {
                            ...edition,
                            [field]: value,
                            isCodeVerified:
                              field === "code"
                                ? false
                                : edition?.isCodeVerified,
                            isChecked:
                              field === "code" ? false : edition?.isChecked,
                          }
                        : edition
                    )
                  : plan?.monthlyPlans,
              yearlyPlans:
                type === "Yearly"
                  ? plan?.yearlyPlans?.map((edition) =>
                      edition?.editionID === editionID
                        ? {
                            ...edition,
                            [field]: value,
                            isCodeVerified:
                              field === "code"
                                ? false
                                : edition?.isCodeVerified,
                            isChecked:
                              field === "code" ? false : edition?.isChecked,
                          }
                        : edition
                    )
                  : plan?.yearlyPlans,
            }
          : plan
      )
    );
  };
  const handleSubmit = async () => {
    try {
      let isValid = true;
      let errorMessage = "";

      for (const plan of productPlans) {
        if (!plan.countryId) {
          isValid = false;
          errorMessage = "Please select a country for all plans.";
          break;
        }
        const allPlans = [
          ...(plan.monthlyPlans || []),
          ...(plan.yearlyPlans || []),
        ];

        for (const edition of allPlans) {
          const requiredFields = [
            { key: "planName", label: "Plan Name" },
            { key: "planPrice", label: "Plan Price" },
            { key: "billingCycle", label: "Billing Cycle" },
            { key: "code", label: "Plan Code" },
            { key: "offerPrice", label: "Offer Price" },
            { key: "editionID", label: "Edition ID" },
          ];

          for (const field of requiredFields) {
            if (
              edition[field.key] === undefined ||
              edition[field.key] === null ||
              edition[field.key] === ""
            ) {
              isValid = false;
              errorMessage = `Please fill in "${
                field.label
              }" for all plans in ${plan.countryName || "a country"}.`;
              break;
            }
          }

          if (!isValid) break;
          if (edition?.isCodeVerified === false) {
            isValid = false;
            errorMessage = `Some plan codes in ${
              plan.countryName || "a country"
            } are not valid. Please ensure all plan codes are valid.`;
            break;
          }
        }

        if (!isValid) break;
      }

      if (!isValid) {
        showToast({
          message: errorMessage,
          type: "error",
        });
        return;
      }
      const sendData = productPlans.flatMap((plan) =>
        [...(plan.monthlyPlans || []), ...(plan.yearlyPlans || [])]
          .filter((edition) => edition?.editionID)
          .map((edition) => ({
            planID: edition?.planID ?? null,
            planName: edition?.planName ?? "",
            planPrice: edition?.planPrice ?? null,
            billingCycle: edition?.billingCycle ?? "",
            isActive: edition?.isActive ?? true,
            code: edition?.code ?? "",
            offerPrice: edition?.offerPrice ?? null,
            description: edition?.description ?? "",
            countryID: plan?.countryId ?? "",
            editionID: edition?.editionID ?? null,
          }))
      );
      const res = await api.post(`/api/v1/product-plan`, sendData);
      if (res?.status == 200) {
        showToast({
          message: `Plans added successfully.`,
          type: "success",
        });
        router.push(`/products/${productId}`);
      } else {
        throw new Error("Failed to create permission module.");
      }
    } catch {
      showToast({
        message: "Something went wrong while submitting.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    // Create a controller for canceling ongoing requests
    const controller = new AbortController();
    const debounceDelay = 500; // 🕒 adjust debounce time (ms)

    const handler = setTimeout(async () => {
      try {
        const allUnverifiedCodes = productPlans
          .flatMap((plan) => [
            ...(plan.monthlyPlans || []),
            ...(plan.yearlyPlans || []),
          ])
          .filter((p) => p?.code && !p?.isCodeVerified && !p?.isChecked)
          .map((p) => p.code);

        if (allUnverifiedCodes.length === 0) return;

        console.log("Codes to verify:", allUnverifiedCodes);

        const res = await api.post(
          "/api/v1/product-plan/check-plancodes",
          [...new Set(allUnverifiedCodes)],
          { signal: controller.signal }
        );

        const results = res?.data?.data || {};

        setProductPlans((prev) =>
          prev.map((plan) => ({
            ...plan,
            monthlyPlans: plan.monthlyPlans?.map((p) => {
              const existsInApi = results.hasOwnProperty(p.code);
              return {
                ...p,
                isCodeVerified: !existsInApi,
                isChecked: true,
              };
            }),
            yearlyPlans: plan.yearlyPlans?.map((p) => {
              const existsInApi = results.hasOwnProperty(p.code);
              return {
                ...p,
                isCodeVerified: !existsInApi,
                isChecked: true,
              };
            }),
          }))
        );
      } catch (err: any) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          console.log("Previous verification request canceled");
        } else {
          console.error("Error verifying plan codes:", err);
        }
      }
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [productPlans]);

  return (
    <div>
      <div className="flex flex-row items-center justify-between my-4">
        <h2 className="font-semibold">Product Plans</h2>
      </div>
      <div className="p-4 rounded-lg border-[1px] border-gray-300">
        <div className="flex items-center gap-3 my-4">
          <div
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
            onClick={() => router.back()}
          >
            <IoMdArrowBack className="w-6 h-6" />
          </div>
          <h2 className="font-semibold text-gray-800 text-xl">
            Create Plans For {productName} ({productCode})
          </h2>
        </div>
        {productPlans?.map((productPlan, index) => {
          return (
            <div
              className="grid grid-cols-1 md:grid-cols-2 mb-10"
              key={`${productPlan?.id ?? 0}-${
                productPlan?.countryName ?? "unknown"
              }`}
            >
              <div className="flex items-center w-full my-4 col-span-2">
                <div className="mr-2 cursor-pointer">
                  {productPlan?.isCollapsed ? (
                    <CiCirclePlus
                      className="w-5 h-5"
                      onClick={() => setCollapse(productPlan?.id, false)}
                    />
                  ) : (
                    <AiOutlineMinusCircle
                      className="w-5 h-5"
                      onClick={() => setCollapse(productPlan?.id, true)}
                    />
                  )}
                </div>
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-gray-500 text-sm font-medium">
                  {productPlan?.countryName || "Select Country"}
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
                {index !== 0 && (
                  <div>
                    {" "}
                    <MdDeleteOutline
                      onClick={() => deletePlan(productPlan?.id)}
                      className="w-5 h-5 text-red-400 cursor-pointer"
                    />{" "}
                  </div>
                )}
              </div>

              {!productPlan?.isCollapsed && (
                <>
                  {/* Country Selector */}
                  <div className="col-span-1 mb-4">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Country
                    </label>
                    <div className="relative w-full">
                      <select
                        id="country"
                        value={
                          productPlan?.countryId +
                          "__" +
                          productPlan?.countryName +
                          "__" +
                          productPlan?.countryCode
                        }
                        onChange={(e) =>
                          changeCountry(productPlan?.id, e.target.value)
                        }
                        className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                      >
                        <option value="">
                          {isCountryLoading ? "Loading..." : "Select"}
                        </option>
                        {countries?.map((country, index) => (
                          <option
                            value={
                              country?.countryId +
                              "__" +
                              country?.countryName +
                              "__" +
                              country?.countryCode
                            }
                            key={index}
                          >
                            {country?.countryName}
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <FiChevronDown className="text-gray-600" />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Tables Section */}
                  <div className="col-span-2 space-y-8">
                    {/* Monthly Plan */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Monthly Plans
                      </h3>
                      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                        <table className="min-w-full text-sm text-left border-collapse">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Edition Name
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Plan Code
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700 min-w-80">
                                Plan Name
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Standard Price
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Offer Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productPlan?.monthlyPlans?.map(
                              (monthlyPlan, index) => (
                                <tr
                                  key={index + "m" + monthlyPlan?.editionID}
                                  className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                  <td className="px-4 py-2">
                                    {monthlyPlan?.editionName}
                                  </td>
                                  <td className="px-4 py-2">
                                    <div className="flex flex-row gap-2 items-center">
                                      <input
                                        type="text"
                                        value={monthlyPlan?.code}
                                        disabled={monthlyPlan?.planID}
                                        onChange={(e) =>
                                          changeValue(
                                            "code",
                                            e.target.value,
                                            productPlan?.id,
                                            "Monthly",
                                            monthlyPlan?.editionID
                                          )
                                        }
                                        className={`w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                                          monthlyPlan?.planID
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : ""
                                        }`}
                                      />
                                      <div>
                                        {monthlyPlan?.code &&
                                        monthlyPlan?.isCodeVerified ? (
                                          <GiCheckMark className="text-green-500 w-4 h-4" />
                                        ) : (
                                          <HiMiniXMark className="text-red-500 w-5 h-5" />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="text"
                                      value={monthlyPlan?.planName}
                                      onChange={(e) =>
                                        changeValue(
                                          "planName",
                                          e.target.value,
                                          productPlan?.id,
                                          "Monthly",
                                          monthlyPlan?.editionID
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="number"
                                      value={monthlyPlan?.planPrice ?? ""}
                                      onChange={(e) =>
                                        changeValue(
                                          "planPrice",
                                          e.target.value,
                                          productPlan?.id,
                                          "Monthly",
                                          monthlyPlan?.editionID
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="number"
                                      value={monthlyPlan?.offerPrice ?? ""}
                                      onChange={(e) =>
                                        changeValue(
                                          "offerPrice",
                                          e.target.value,
                                          productPlan?.id,
                                          "Monthly",
                                          monthlyPlan?.editionID
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Yearly Plan */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Yearly Plans
                      </h3>
                      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                        <table className="min-w-full text-sm text-left border-collapse">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Edition Name
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Plan Code
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700 min-w-80">
                                Plan Name
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Standard Price
                              </th>
                              <th className="px-4 py-2 font-medium text-gray-700">
                                Offer Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productPlan?.yearlyPlans?.map(
                              (yearlyPlan, index) => (
                                <tr
                                  key={index + "y" + yearlyPlan?.editionID}
                                  className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                  <td className="px-4 py-2">
                                    {yearlyPlan?.editionName}
                                  </td>
                                  <td className="px-4 py-2">
                                    <div className="flex flex-row gap-2 items-center">
                                      <input
                                        type="text"
                                        value={yearlyPlan?.code}
                                        disabled={yearlyPlan?.planID}
                                        onChange={(e) =>
                                          changeValue(
                                            "code",
                                            e.target.value,
                                            productPlan?.id,
                                            "Yearly",
                                            yearlyPlan?.editionID
                                          )
                                        }
                                        className={`w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                                          yearlyPlan?.planID
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : ""
                                        }`}
                                      />
                                      <div>
                                        {yearlyPlan?.code &&
                                        yearlyPlan?.isCodeVerified ? (
                                          <GiCheckMark className="text-green-500 w-4 h-4" />
                                        ) : (
                                          <HiMiniXMark className="text-red-500 w-5 h-5" />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="text"
                                      value={yearlyPlan?.planName}
                                      onChange={(e) =>
                                        changeValue(
                                          "planName",
                                          e.target.value,
                                          productPlan?.id,
                                          "Yearly",
                                          yearlyPlan?.editionID
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="number"
                                      value={yearlyPlan?.planPrice ?? ""}
                                      onChange={(e) =>
                                        changeValue(
                                          "planPrice",
                                          e.target.value,
                                          productPlan?.id,
                                          "Yearly",
                                          yearlyPlan?.editionID
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input
                                      type="number"
                                      value={yearlyPlan?.offerPrice ?? ""}
                                      onChange={(e) =>
                                        changeValue(
                                          "offerPrice",
                                          e.target.value,
                                          productPlan?.id,
                                          "Yearly",
                                          yearlyPlan?.editionID
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        <div className="flex flex-row items-center justify-between">
          <button
            className="text-blue-500 underline cursor-pointer"
            onClick={AddNewRow}
          >
            + Add New
          </button>
          <button
            className="px-8 py-1 rounded text-white bg-gray-800 text-sm cursor-pointer"
            onClick={handleSubmit}
          >
            Update Plans
          </button>
        </div>
      </div>
    </div>
  );
}
