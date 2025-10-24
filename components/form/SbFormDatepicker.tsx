import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
type SbFormInputProps = {
  field: {
    label: string;
    key: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    style?: string;
  };
  value: Date;
  handleFormDataChange(key: string, value: any): void;
};

export default function SbFormDatepicker({
  field,
  value,
  handleFormDataChange,
}: SbFormInputProps) {
  const handleChange = (date: Date | null) => {
    handleFormDataChange(field?.key, date);
  };
  return (
    <div className={`${field.style} w-full`}>
      <label
        htmlFor={field?.label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {field?.label}{" "}
        {field?.required && <span className="text-lg text-red-500">*</span>}
      </label>

      <DatePicker
        selected={value}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        wrapperClassName="w-full"
        className="w-full px-3 py-2 h-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        popperClassName="shadow-lg border rounded-lg"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
}
