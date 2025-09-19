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

export default function SbFormInputbox({
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
        htmlFor="description"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {field?.label} {field?.required && <span className="text-lg text-red-500">*</span>}
      </label>
      <input
        type="text"
        id="description"
        name="description"
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder={field?.placeholder}
        required={field?.required ?? false}
      />
    </div>
  );
}
