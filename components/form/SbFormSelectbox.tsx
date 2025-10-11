import api from "@/lib/axios";
import { ChangeEvent, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { showToast } from "../common/ShowToast";
type SbFormInputProps = {
  field: {
    label: string;
    key: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    style?: string;
    getListUrl?: string;
    defaultList?: any[];
    valueKey: string;
    optionKey: string;
  };
  value: string;
  handleFormDataChange(key: string, value: string): void;
};

export default function SbFormSelectbox({
  field,
  value,
  handleFormDataChange,
}: SbFormInputProps) {
  const [list, setList] = useState<any[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const getAllRoles = async (url: string) => {
    try {
      setIsListLoading(true);
      const res = await api.get(url);
      if (res?.data?.message) {
        setList(res?.data?.data);
      } else {
        throw new Error("Password reset failed");
      }
    } catch {
      return showToast({
        message: "Failed to fetch list.",
        type: "error",
      });
    } finally {
      setIsListLoading(false);
    }
  };
  useEffect(() => {
    if (field?.defaultList) {
      setList(field?.defaultList);
    } else if (field?.getListUrl) {
      getAllRoles(field?.getListUrl);
    }
  }, [field?.getListUrl, field?.defaultList]);
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleFormDataChange(field?.key, e.target.value);
  };
  return (
    <div className={`${field.style}`}>
      <label
        htmlFor={field?.label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {field?.label}{" "}
        {field?.required && <span className="text-lg text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={handleChange}
          className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
          required={field?.required ?? false}
        >
          <option value="">{isListLoading ? "Loading..." : "Select"}</option>
          {list?.map((item, index) => {
            return (
              <option value={item?.[field?.valueKey]} key={index}>
                {item?.[field?.optionKey]}
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
  );
}
