import { ChangeEvent } from "react";
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

export default function SbFormNumber({
  field,
  value,
  handleFormDataChange,
}: SbFormInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFormDataChange(field?.key, e.target.value);
  };
  return (
    <div className={`${field.style}`}>
      <label
        htmlFor={field?.label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {field?.label} {field?.required && <span className="text-lg text-red-500">*</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 h-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder={field?.placeholder}
        required={field?.required ?? false}
      />
    </div>
  );
}
