"use client";
import { showToast } from "@/components/common/ShowToast";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";
import { CurrencyDetailsType, PaymentGateway } from "@/types/auth";
import { FaSave, FaTimes } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
interface GetPaymentGatewayResponse {
  success: boolean;
  message: string;
  data: PaymentGateway[];
}
interface GetCurrenciesResponse {
  success: boolean;
  message: string;
  data: CurrencyDetailsType[];
}

export default function MapGatewayToCountry() {
  const router = useRouter();
  const [countries, setCountries] = useState<any[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<
    {
      gatewayID: string;
      providerName: string;
      isSelected: boolean;
      isDefault: boolean;
    }[]
  >([]);
  const [currencies, setCurrencies] = useState<CurrencyDetailsType[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCurrencies, setSelecteCurrencies] = useState<
    {
      currencyID: string;
      currencyCode: string;
      isSelected: boolean;
      isDefault: boolean;
    }[]
  >([]);
  const [gatewayStates, setGatewayStates] = useState<
    Record<string, { isAvailable: boolean; isDefault: boolean }>
  >({});
  const getCounties = async () => {
    try {
      setIsListLoading(true);
      const res = await api.get("/api/v1/common/countries");
      if (res?.data?.message) {
        setCountries(res?.data?.data);
      } else {
        throw new Error("Failed to get countries.");
      }
    } catch {
      return showToast({
        message: "Failed to fetch countries.",
        type: "error",
      });
    } finally {
      setIsListLoading(false);
    }
  };
  const getCurrencies = async () => {
    try {
      setIsListLoading(true);
      const res = await api.get<GetCurrenciesResponse>(
        "/api/v1/common/Currency"
      );
      if (res?.data?.message) {
        setCurrencies(res?.data?.data);
      } else {
        throw new Error("Failed to get correncies.");
      }
    } catch {
      return showToast({
        message: "Failed to fetch countries.",
        type: "error",
      });
    } finally {
      setIsListLoading(false);
    }
  };
  const getPaymentGateways = async () => {
    try {
      setIsListLoading(true);
      const res = await api.get<GetPaymentGatewayResponse>(
        "/api/v1/payment-gateway"
      );
      if (res?.data?.message) {
        setPaymentGateways(
          res?.data?.data?.map((gateway) => {
            return {
              gatewayID: gateway?.gatewayID,
              providerName: gateway?.providerName,
              isSelected: false,
              isDefault: false,
            };
          }) ?? []
        );
      } else {
        throw new Error("Failed to get payment gateways.");
      }
    } catch {
      return showToast({
        message: "Failed to get payment gateways.",
        type: "error",
      });
    } finally {
      setIsListLoading(false);
    }
  };
  useEffect(() => {
    getCounties();
    getPaymentGateways();
    getCurrencies();
  }, []);
  const handleCheckboxChange = (
    id: string,
    field: "isAvailable" | "isDefault"
  ) => {
    setGatewayStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id][field],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry) {
      return showToast({
        message: "Please select a country.",
        type: "error",
      });
    }

    const mappedData = Object.entries(gatewayStates).map(([id, values]) => ({
      gatewayID: id,
      countryID: selectedCountry,
      ...values,
    }));

    // Perform API submission here
    console.log("Submitting:", mappedData);

    showToast({
      message: "Gateway mapping submitted.",
      type: "success",
    });
  };
  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelecteCurrencies((prev) => [
      ...prev,
      {
        currencyID: e?.target?.value?.split("___")?.[0],
        currencyCode: e.target.value?.split("___")?.[1],
        isSelected: true,
        isDefault: false,
      },
    ]);
  };
  const handleDeleteCurrency = (currencyID: string) => {
    setSelecteCurrencies((prev) =>
      prev?.filter((currency) => currency?.currencyID !== currencyID)
    );
  };

  const handleGatewayChange = (
    gatewayId: string,
    type: "isSelected" | "isDefault",
    status: boolean
  ) => {
    setPaymentGateways((prev) =>
      prev.map((gateway) => {
        if (type === "isSelected") {
          return gateway.gatewayID === gatewayId
            ? {
                ...gateway,
                isSelected: status,
                isDefault: status ? gateway?.isDefault : false,
              }
            : gateway;
        }

        if (type === "isDefault") {
          return {
            ...gateway,
            isDefault: gateway.gatewayID === gatewayId ? status : false,
          };
        }

        return gateway;
      })
    );
  };
  const handleCurrencyDefaultChange = (currencyID: string, status: boolean) => {
    setSelecteCurrencies((prev) =>
      prev.map((currency) => {
        return {
          ...currency,
          isDefault: currency.currencyID === currencyID ? status : false,
        };
      })
    );
  };
  return (
    <ValidatePermissions
      permissionType="canCreate"
      path="/settings/payment-gateways"
    >
      <div>
        <h2 className="font-semibold text-md mb-2">Payment Gateway</h2>
        <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <div
              className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
              onClick={() => router.back()}
            >
              <IoMdArrowBack className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Map Payment Gateways
              </h2>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor={"country"}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                    <span className="text-lg text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      //   value={value}
                      //   onChange={handleChange}
                      className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                      required={true}
                    >
                      <option value="">
                        {isListLoading ? "Loading..." : "Select"}
                      </option>
                      {countries?.map((country, index) => {
                        return (
                          <option value={country?.countryId} key={index}>
                            {country?.countryName}
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

                <div>
                  <label
                    htmlFor={"country"}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Add Currency
                    <span className="text-lg text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      value={""}
                      onChange={handleCurrencyChange}
                      className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                    >
                      <option value="">
                        {isListLoading ? "Loading..." : "Select"}
                      </option>
                      {currencies?.map((country, index) => {
                        return (
                          <option
                            value={
                              country?.currencyID +
                              "___" +
                              country?.currencyCode
                            }
                            key={index}
                          >
                            {country?.currencyCode}
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
                {paymentGateways?.length > 0 && (
                  <div className="overflow-x-auto col-span-1">
                    <table className="w-full table-auto border border-gray-200 rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left px-4 py-2 border-b-[1px] border-gray-300 text-sm font-medium text-gray-600">
                            Gateway Name
                          </th>
                          <th className="text-center px-4 py-2 border-b-[1px] border-gray-300 text-sm font-medium text-gray-600">
                            Available
                          </th>
                          <th className="text-center px-4 py-2 border-b-[1px] border-gray-300 text-sm font-medium text-gray-600">
                            Default
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentGateways?.map((gateway) => (
                          <tr
                            key={gateway.gatewayID}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 border-b-[1px] border-gray-300 text-sm">
                              {gateway.providerName}
                            </td>
                            <td className="text-center px-4 py-2 border-b-[1px] border-gray-300">
                              <input
                                type="checkbox"
                                checked={gateway?.isSelected}
                                onChange={(e) =>
                                  handleGatewayChange(
                                    gateway?.gatewayID,
                                    "isSelected",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td className="text-center px-4 py-2 border-b-[1px] border-gray-300">
                              <input
                                type="checkbox"
                                checked={gateway?.isDefault}
                                onChange={(e) =>
                                  handleGatewayChange(
                                    gateway?.gatewayID,
                                    "isDefault",
                                    e.target.checked
                                  )
                                }
                                disabled={!gateway?.isSelected}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {selectedCurrencies?.length > 0 && (
                  <div className="overflow-x-auto col-span-1">
                    <table className="w-full table-auto border border-gray-200 rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left px-4 py-2 border-b-[1px] border-gray-300 text-sm font-medium text-gray-600">
                            Currency Name
                          </th>
                          <th className="text-center px-4 py-2 border-b-[1px] border-gray-300 text-sm font-medium text-gray-600">
                            Default
                          </th>
                          <th className="text-center px-4 py-2 border-b-[1px] border-gray-300 text-sm font-medium text-gray-600"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCurrencies?.map((currency) => (
                          <tr
                            key={currency?.currencyID}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 border-b-[1px] border-gray-300 text-sm">
                              {currency?.currencyCode}
                            </td>
                            <td className="text-center px-4 py-2 border-b-[1px] border-gray-300">
                              <input
                                type="checkbox"
                                checked={currency?.isDefault}
                                onChange={(e) =>
                                  handleCurrencyDefaultChange(
                                    currency?.currencyID,
                                    e?.target?.checked
                                  )
                                }
                              />
                            </td>
                            <td className="text-center px-4 py-2 border-b-[1px] border-gray-300">
                              <MdOutlineDelete
                                className="w-4 h-4 text-red-400 cursor-pointer"
                                onClick={() =>
                                  handleDeleteCurrency(currency?.currencyID)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 col-span-2">
                  <button
                    type="button"
                    //   onClick={handleClear}
                    className="px-4 py-2 border border-gray-300 rounded-md md:text-sm text-[10px] font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <FaTimes className="inline mr-2" />
                    Clear
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md md:text-sm text-[10px] font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <FaSave className="inline mr-2" />
                    Save Mapping
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ValidatePermissions>
  );
}
