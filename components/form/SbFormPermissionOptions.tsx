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
  value: any;
  handleFormDataChange(key: string, value: any): void;
};

export default function SbFormPermissionOptions({field, value, handleFormDataChange}:SbFormInputProps) {
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
        <input type="checkbox" className="form-checkbox text-blue-600" checked={value?.haveRead} onChange={(e)=>handleFormDataChange("haveRead",e.target.checked)}/>
         View
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" className="form-checkbox text-blue-600" checked={value?.haveCreate} onChange={(e)=>handleFormDataChange("haveCreate",e.target.checked)}/>
         Create
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" className="form-checkbox text-blue-600" checked={value?.haveUpdate} onChange={(e)=>handleFormDataChange("haveUpdate",e.target.checked)}/>
         Edit
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" className="form-checkbox text-blue-600" checked={value?.haveDelete} onChange={(e)=>handleFormDataChange("haveDelete",e.target.checked)}/>
         Delete
      </label>
    </div>
  </div>
);
}
