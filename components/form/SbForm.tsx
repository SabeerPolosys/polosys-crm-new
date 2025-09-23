import { FormEvent } from "react";
import SbFormInputbox from "./SbFormInputbox";
import { FaSave, FaTimes } from "react-icons/fa";
import SbFormPassword from "./SbFormPassword";
import SbFormSelectbox from "./SbFormSelectbox";

export default function SbForm({
  formField,
  handleSubmit,
  handleClear,
  formData,
  handleFormDataChange,
  submitType,
}: {
  formField: any;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleClear(): void;
  formData: any;
  handleFormDataChange(key:string, value:string): void;
  submitType?: "Create" | "Update"
}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {formField?.fields?.map((field: any, index: number) => {
            switch (field?.type) {
              case "input":
                return (
                  <SbFormInputbox
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "password":
                return (
                  <SbFormPassword
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              case "select":
                return (
                  <SbFormSelectbox
                    field={field}
                    key={index}
                    value={formData[field?.key] ?? ""}
                    handleFormDataChange={handleFormDataChange}
                  />
                );
              default:
                break;
            }
          })}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {formField?.hasClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <FaTimes className="inline mr-2" />
              Clear
            </button>
          )}
          {formField?.hasSubmitButton && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <FaSave className="inline mr-2" />
              {formField?.submitButtonLabel
                ? submitType
                  ? submitType + " " + formField?.submitButtonLabel
                  : formField?.submitButtonLabel
                : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
