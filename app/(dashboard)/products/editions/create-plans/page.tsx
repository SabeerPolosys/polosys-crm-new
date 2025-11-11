"use client";
import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import { ProductEdition } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
type GetProductEditionResponse = {
  success: boolean;
  message: string;
  data: ProductEdition[];
};

export default function CreatePlan() {
  const [countries, setCountries] = useState<any[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [editionDetails, setEditionDetails] = useState<ProductEdition[]>([]);
  const [planDetais, setPlanDetails] = useState([
    { id: 1, country: "India", isCollapsed: false },
    // { id: 2, country: "Saudi Arabia", isCollapsed: false },
  ]);
  const searchParams = useSearchParams();
  const productCode = searchParams.get("productCode");
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
    setPlanDetails((prev) =>
      prev?.map((plan) =>
        plan?.id === planId ? { ...plan, isCollapsed: status } : plan
      )
    );
  };
  const AddNewRow = () => {
    setPlanDetails([
      { id: 1, country: "India", isCollapsed: true },
      { id: 2, country: "", isCollapsed: false },
    ]);
  };
  return (
    <div>
      <div className="flex flex-row items-center justify-between my-4">
        <h2 className="font-semibold">Product Plans</h2>
      </div>
      <div className="p-4 rounded-lg border-[1px] border-gray-300">
        {planDetais?.map((plan) => {
          return (
            <div
              className="grid grid-cols-1 md:grid-cols-2 mb-10"
              key={plan?.country}
            >
              <div className="flex items-center w-full my-4 col-span-2">
                <div className="mr-2 cursor-pointer">
                  {plan?.isCollapsed ? (
                    <CiCirclePlus
                      className="w-5 h-5"
                      onClick={() => setCollapse(plan?.id, false)}
                    />
                  ) : (
                    <AiOutlineMinusCircle
                      className="w-5 h-5"
                      onClick={() => setCollapse(plan?.id, true)}
                    />
                  )}
                </div>
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-gray-500 text-sm font-medium">
                  {plan?.country || "Select Country"}
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
                <div>
                  {" "}
                  <MdDeleteOutline className="w-5 h-5 text-red-400" />{" "}
                </div>
              </div>

              {!plan?.isCollapsed && (
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
                        className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                      >
                        <option value="">
                          {isCountryLoading ? "Loading..." : "Select"}
                        </option>
                        {countries?.map((country, index) => (
                          <option value={country?.countryId} key={index}>
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
                            {editionDetails?.map((edition) => (
                              <tr
                                key={edition?.editionId}
                                className="border-t border-gray-200 hover:bg-gray-50"
                              >
                                <td className="px-4 py-2">{edition?.eName}</td>
                                <td className="px-4 py-2">
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                              </tr>
                            ))}
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
                            {editionDetails?.map((edition) => (
                              <tr
                                key={edition?.editionId}
                                className="border-t border-gray-200 hover:bg-gray-50"
                              >
                                <td className="px-4 py-2">{edition?.eName}</td>
                                <td className="px-4 py-2">
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                              </tr>
                            ))}
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
        <div>
          <button
            className="text-blue-500 underline cursor-pointer"
            onClick={AddNewRow}
          >
            + Add New
          </button>
        </div>
      </div>
    </div>
  );
}
