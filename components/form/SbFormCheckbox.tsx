import { ChangeEvent } from "react";

type SbCheckboxProps = {
  handleFormDataChange(key: string, value: any): void;
  value: boolean;
  field: {
    key: string;
    type: string;
    label: string;
    style?: string;
  };
};

export default function SbFormCheckbox({
  value,
  handleFormDataChange,
  field,
}: SbCheckboxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFormDataChange(field?.key, e.target.checked);
  };
  return (
    <div className={`${field.style}`}>
      <label
        htmlFor={field?.label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        <br />
      </label>
      <div className="h-9 py-2 flex flex-row items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={value}
          className="w-4 h-4"
          onChange={handleChange}
        />
        <label>{field?.label}</label>
      </div>
    </div>
  );
}
