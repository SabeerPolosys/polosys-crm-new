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

export default function SbFormPermissionOptions({field}:SbFormInputProps) {
  return (
  <div className={`${field.style}`}>
    {/* Label */}
    <label
      htmlFor={field?.label}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {field?.label}
      {field?.required && <span className="text-red-500 ml-1">*</span>}
    </label>

    {/* Permission Checkboxes */}
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" className="form-checkbox text-blue-600" />
         View
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" className="form-checkbox text-blue-600" />
         Create
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" className="form-checkbox text-blue-600" />
         Edit
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" className="form-checkbox text-blue-600" />
         Delete
      </label>
    </div>
  </div>
);
}
