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

interface CountryCurrencyMapping {
  countryMappingID: string;
  countryID: string;
  countryName: string;
  countryCode: string;
  currencyID: string;
  currencyCode: string;
  symbol: string;
  decimalPlaces: number;
  isDefault: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface GetCountryCorrecnyMappingResponse {
  success: boolean;
  message: string;
  data: CountryCurrencyMapping[];
}
export interface GetPaymentGatewayMappingResponse {
  success: boolean;
  message: string;
  data: PaymentGatewaySelected[];
  errors: string[];
}

export interface PaymentGatewaySelected {
  gatewayID: string;
  providerName: string;
  countryID: string;
  countryName: string;
  isDefault: boolean;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry) {
      return showToast({
        message: "Please select a country.",
        type: "error",
      });
    }

    // Build currency and gateway payloads
    const currencyMapping =
      selectedCurrencies?.map((currency) => ({
        countryID: selectedCountry,
        currencyID: currency?.currencyID,
        isDefault: currency?.isDefault,
      })) || [];

    const selectedGateways =
      paymentGateways
        ?.filter((gateway) => gateway?.isSelected)
        ?.map((gateway) => ({
          gatewayID: gateway?.gatewayID,
          countryID: selectedCountry,
          isActive: true,
          isDefault: gateway?.isDefault,
        })) || [];

    if (currencyMapping.length === 0 || selectedGateways.length === 0) {
      return showToast({
        message: "Please select at least one currency and gateway.",
        type: "error",
      });
    }
    const isHaveDefaultCurrency = currencyMapping?.some(
      (currency) => currency?.isDefault
    );
    const isHaveDefaultGateway = selectedGateways?.some(
      (gateway) => gateway?.isDefault
    );
    if (!isHaveDefaultCurrency) {
      return showToast({
        message: "Please select a default currency.",
        type: "error",
      });
    }
    if (!isHaveDefaultGateway) {
      return showToast({
        message: "Please select a default payment gateway.",
        type: "error",
      });
    }

    try {
      const [currencyRes, gatewayRes] = await Promise.allSettled([
        api.post(`/api/v1/common/Country-Curruncy`, currencyMapping),
        api.post(`/api/v1/payment-gateway/country-mapping`, selectedGateways),
      ]);
      if (
        currencyRes.status === "fulfilled" &&
        currencyRes.value?.status === 200
      ) {
        showToast({
          message: "Currency mapping updated successfully.",
          type: "success",
        });
      } else {
        showToast({
          message: "Failed to update currency mapping.",
          type: "error",
        });
      }

      if (
        gatewayRes.status === "fulfilled" &&
        gatewayRes.value?.status === 200
      ) {
        showToast({
          message: "Payment gateway mapping updated successfully.",
          type: "success",
        });
        router.push("/settings/map-to-country");
      } else {
        showToast({
          message: "Failed to update gateway mapping.",
          type: "error",
        });
      }
    } catch {
      showToast({
        message: "Unexpected error while updating mappings.",
        type: "error",
      });
    }
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const isExist = selectedCurrencies?.find((currency) => {
      return currency?.currencyID === e?.target?.value?.split("___")?.[0];
    });

    if (isExist) {
      showToast({
        message: "Currency already exist in list.",
        type: "error",
      });
      return;
    }
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
  const handleClear = () => {
    setSelectedCountry("");
    setSelecteCurrencies([]);
    setPaymentGateways((prev) =>
      prev?.map((gateway) => {
        return { ...gateway, isSelected: false, isDefault: false };
      })
    );
  };
  useEffect(() => {
    const getCountryCurrencyMapping = async () => {
      try {
        if (!selectedCountry) return;
        const result = await api.get<GetCountryCorrecnyMappingResponse>(
          `/api/v1/common/Country-Curruncy-Mapping/${selectedCountry}`
        );
        if (result?.status === 200) {
          setSelecteCurrencies(
            result?.data?.data?.map((currency) => ({
              currencyID: currency?.currencyID,
              currencyCode: currency?.currencyCode,
              isSelected: true,
              isDefault: currency?.isDefault,
            }))
          );
        }
      } catch {
        showToast({
          message: "Failed to fetch currency mapping of selected country.",
          type: "error",
        });
      }
    };
    const getPaymentGatewayMapping = async () => {
      try {
        if (!selectedCountry) return;
        const result = await api.get<GetPaymentGatewayMappingResponse>(
          `/api/v1/payment-gateway/PaymentGateWay-Country/${selectedCountry}`
        );
        if (result?.status === 200) {
          const response = result?.data?.data;
          setPaymentGateways((prev) => {
            if (!prev || !response) return prev;
            const responseMap = new Map(
              response.map((item) => [item.gatewayID, item])
            );

            return prev.map((gateway) => {
              const details = responseMap.get(gateway.gatewayID);

              if (details) {
                return {
                  ...gateway,
                  isSelected: true,
                  isDefault: details.isDefault,
                };
              }

              return {
                ...gateway,
                isSelected: false,
                isDefault: false,
              };
            });
          });
        }
      } catch {
        showToast({
          message:
            "Failed to fetch payment gateway mapping of selected country.",
          type: "error",
        });
      }
    };
    getPaymentGatewayMapping();
    getCountryCurrencyMapping();
  }, [selectedCountry]);
  return (
    <ValidatePermissions permissionType="canCreate">
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
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
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
                    onClick={handleClear}
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
