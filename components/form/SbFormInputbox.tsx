import { usePathname } from "next/navigation";
import { ChangeEvent } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
type SbFormInputProps = {
  field: {
    label: string;
    key: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    style?: string;
    isExistCheck?: boolean;
  };
  value: string;
  handleFormDataChange(key: string, value: string): void;
  isCodeExist?: boolean;
};

export default function SbFormInputbox({
  field,
  value,
  handleFormDataChange,
  isCodeExist,
}: SbFormInputProps) {
  const pathname = usePathname();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFormDataChange(field?.key, e.target.value);
  };
  return (
    <div className={`${field.style}`}>
      <div className="flex flex-row items-center justify-between">
        <label
          htmlFor={field?.label}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field?.label}{" "}
          {field?.required && <span className="text-lg text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {field?.isExistCheck && value && isCodeExist === true && (
            <>
              <FaRegCircleXmark className="w-4 h-4 text-red-500" />
              <span className="text-red-500 text-sm">Code Exists</span>
            </>
          )}

          {field?.isExistCheck && value && isCodeExist === false && (
            <>
              <IoIosCheckmarkCircleOutline className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm">Code is Valid</span>
            </>
          )}
        </div>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-9 ${(field?.isExistCheck && pathname?.includes("/update")) ? "bg-gray-200 cursor-not-allowed" : ""}`}
        placeholder={field?.placeholder}
        required={field?.required ?? false}
        disabled={field?.isExistCheck && pathname?.includes("/update")}
      />
    </div>
  );
}
