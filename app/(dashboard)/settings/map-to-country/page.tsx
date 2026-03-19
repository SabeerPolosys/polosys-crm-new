"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import CustomSelect from "@/components/customers/CustomSelect";
interface SelectedCurrenciesType {
  currencyID: string;
  currencyCode: string;
  symbol: string;
  decimalPlaces: number;
  isDefault: boolean;
}

interface SelectedGatewaysType {
  gatewayID: string;
  providerName: string;
  supportedModes: string;
  isActive: boolean;
  isDefault: boolean;
}

interface CountryMappingTypes {
  countryID: string;
  countryName: string;
  countryCode: string;
  currencies: SelectedCurrenciesType[];
  paymentGateways: SelectedGatewaysType[];
}

type GetAllMappingRespose = {
  success: boolean;
  message: string;
  data: CountryMappingTypes[];
};

export default function MappingCurrencyOrGateway() {
  const [countryMappings, setCountryMappings] = useState<any[]>([]);
  const [allMappings, setAllMappings] = useState<CountryMappingTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [country, setCountry] = useState("");
  const [allContries, setAllContries] = useState<any>([]);
  const router = useRouter();
  useEffect(() => {
    const getAllCountries = async () => {
      try {
        const res = await api.get(`/api/v1/common/countries`);
        if (res?.data?.success) {
          const response = res?.data?.data;
          setAllContries(response);
        }
      } catch {
        showToast({
          message: `Failed to fetch countries.`,
          type: "error",
        });
      }
    };
    getAllCountries();
  }, []);
  const transformMappings = (data: CountryMappingTypes[]) => {
    return data
      ?.filter(
        ({ currencies, paymentGateways }) =>
          (currencies?.length ?? 0) > 0 || (paymentGateways?.length ?? 0) > 0,
      )
      ?.map(({ countryName, currencies = [], paymentGateways = [] }) => ({
        countryName,
        gateways: paymentGateways.map((g, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 ${
              g.isDefault ? "text-green-600 font-medium" : "text-gray-700"
            }`}
          >
            {g.providerName}
            {i < paymentGateways.length - 1 && <>,&nbsp;</>}
          </span>
        )),
        currencies: currencies.map((c, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 ${
              c.isDefault ? "text-green-600 font-medium" : "text-gray-700"
            }`}
          >
            {c.currencyCode}
            {i < currencies.length - 1 && <>,&nbsp;</>}
          </span>
        )),
      }));
  };
  useEffect(() => {
    const getAllMapping = async () => {
      try {
        if (isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<GetAllMappingRespose>(
          `/api/v1/common/Country-Details-All`,
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setAllMappings(response);
          setCountryMappings(transformMappings(response));
        }
      } catch {
        showToast({
          message: `Failed to fetch mapping details.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllMapping();
  }, [isDeleteOpen]);
  const columns = [
    { header: "Country Name", accessor: "countryName" },
    { header: "Payment Gateways", accessor: "gateways" },
    { header: "Currencies", accessor: "currencies" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || [],
  );
  const handleSearch = () => {
    let filtered = [...allMappings];

    /** ✅ Country filter */
    if (country) {
      filtered = filtered.filter((c) => c.countryID === country);
    }

    /** Transform for table */
    const formatted = transformMappings(filtered);

    setCountryMappings(formatted);
  };
  const resetFilters = () => {
    setCountry("");
    setCountryMappings(transformMappings(allMappings));
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center mb-4 px-6">
          <h2 className="text-lg font-bold">Gateway Or Currecny Mapping</h2>

          <div className="flex flex-row gap-2 items-center">
            {canCreate && (
              <Link
                href="/settings/map-to-country/create"
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Create Mapping
              </Link>
            )}
          </div>
        </div>
        <div className="px-6">
          <div className="p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 items-end">
              {/* Country */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-slate-500 mb-1">Country</label>
                <CustomSelect
                  value={country}
                  onChange={setCountry}
                  placeholder="Select Country"
                  options={[
                    { label: "All", value: "" },
                    ...allContries?.map((country: any) => ({
                      label: country?.countryName,
                      value: country?.countryId,
                    })),
                  ]}
                  width="w-full"
                />
              </div>
              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="h-10 px-5 bg-gray-800 text-white rounded-lg text-sm font-medium shadow hover:bg-gray-900 transition cursor-pointer"
                >
                  Search
                </button>

                <button
                  onClick={resetFilters}
                  className="h-10 px-5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={countryMappings}
          isDataLoading={isLoading}
          // isEditAllowed={true}
          // isDeleteAllowed={true}
          // onEditClick={() => {}}
          // onDeleteClick={() => {}}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Server"
          deleteId={`?serverId=${deleteId}` as string}
          deleteUrl={"/api/v1/server"}
          redirectUrl={"/settings/servers"}
        />
      </div>
    </ValidatePermissions>
  );
}
