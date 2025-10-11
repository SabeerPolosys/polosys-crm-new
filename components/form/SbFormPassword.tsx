import { ChangeEvent } from "react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
type SbFormInputProps = {
  field: {
    label: string;
    key: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    style?: string;
  };
  value: string;
  handleFormDataChange(key: string, value: string): void;
};

export default function SbFormPassword({
  field,
  value,
  handleFormDataChange,
}: SbFormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFormDataChange(field?.key, e.target.value);
  };
  return (
    <div className={`${field.style}`}>
      <label
        htmlFor={field?.label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {field?.label}
        {field?.required && <span className="text-lg text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          className="w-full px-3 py-2 h-9 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder={field?.placeholder}
          required={field?.required ?? false}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}
